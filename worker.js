/**
 * worker.js — Cloudflare Workers 中转层
 * ---------------------------------------------------------------
 * 用途：保护 DeepSeek API Key，给前端提供 SSE 流式 AI 对话接口
 *
 * 部署方法（5 分钟，详见 docs/P3-完成报告.md）：
 *   1. 登录 Cloudflare → Workers & Pages → Create Worker
 *   2. 命名（推荐 mbti-ai-proxy）
 *   3. Edit Code → 把本文件全部内容粘贴 → Save and Deploy
 *   4. Settings → Variables → 添加：
 *        DEEPSEEK_API_KEY = sk-xxxxxxxxx（类型选 Encrypt）
 *        UNLOCK_SECRET    = mbti-secret-2026（同 index.html 默认；上线前与 index.html 同步更换）
 *   5. 部署后会得到一个 URL，类似：
 *        https://mbti-ai-proxy.<account>.workers.dev
 *      把这个 URL 填到 index.html 的 mbtiApp.aiWorkerUrl 状态里
 *
 * 接口：
 *   POST /chat
 *   Body: { code, user, partner?, messages }
 *   Resp: SSE 流（OpenAI 兼容格式，前端用 ReadableStream 读取）
 *
 * 安全：
 *   - DEEPSEEK_API_KEY 通过 env 注入，前端不可见
 *   - 每次请求验证解锁码（仅 'ai' tier 通过）
 *   - 每 IP 每分钟 10 次速率限制（in-memory，per-isolate）
 *   - 对话历史只取最近 20 条（节省 token + 避免上下文泛滥）
 *
 * 上线前 checklist：
 *   [ ] 删除测试码 MBTI-TEST-AI00（搜索本文件）
 *   [ ] UNLOCK_SECRET 与 index.html 同步换成真随机字符串
 *   [ ] 在 Cloudflare Dashboard 配置额外的 Rate Limiting Rules（可选，进一步加固）
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

// 速率限制 (in-memory per-isolate；MVP 够用，Workers 拓展时改用 KV / Durable Objects)
const rateLimitMap = new Map();
const RATE_LIMIT_PER_MINUTE = 10;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',         // 上线前改成具体域名提升安全
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

/* ============== 1. 解锁码验证（算法与 index.html 完全一致）============== */

async function sha256HexUpper(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function verifyUnlockCode(rawCode, tier, secret) {
  const code = (rawCode || '').toUpperCase().replace(/\s+/g, '');
  // 测试码（上线前删除）
  if (code === 'MBTI-TEST-AI00' && tier === 'ai') return true;
  const m = code.match(/^MBTI-([A-Z0-9]{4})-([A-Z0-9]{4})$/);
  if (!m) return false;
  const [, saltSeed, providedChecksum] = m;
  const expected = (await sha256HexUpper(secret + saltSeed + tier)).slice(0, 4);
  return expected === providedChecksum;
}

/* ============== 2. 系统提示词模板（小满人设）============== */

function buildSystemPrompt(user, partner) {
  const u = user || {};
  const typeCode = u.mbti || '未知';
  const dims = u.dimensions || {};
  const dimStr = (d) => (dims[d] != null) ? Math.abs(dims[d]).toFixed(0) + '%' : '?';
  const atLine = u.atSuffix
    ? `- A/T 维度：${u.atSuffix === 'A' ? 'A 果敢（情绪稳定型）' : 'T 起伏（敏感型）'}`
    : '- A/T 维度：未测';

  let partnerBlock = '';
  if (partner && partner.mbti) {
    const relTypeMap = {
      love: '恋爱中', marriage: '夫妻', friend: '朋友',
      partner: '事业合伙', colleague: '同事'
    };
    partnerBlock = `

关于 TA 的关系对象：
- 对方 MBTI：${partner.mbti}
- 关系类型：${relTypeMap[partner.relationType] || partner.relationType || '未知'}
- 三盘合一匹配总分：${partner.score != null ? partner.score + '/100' : '未知'}
- 红绿灯：${partner.signalsLevel || '未知'}
${partner.signals && partner.signals.length ? '- 已触发的风险信号：' + partner.signals.map(s => s.title).join('、') : ''}`;
  }

  return `你是「小满」，35 岁的女性情感顾问。汉学功底深厚 + 心理学专业，但说话像用户最聪明的那个闺蜜。

刚刚有一位老朋友来找你聊天。关于 TA 的背景：
- MBTI 类型：${typeCode}
- 维度强度：E/I ${dimStr('EI')} · S/N ${dimStr('SN')} · T/F ${dimStr('TF')} · J/P ${dimStr('JP')}
${atLine}${partnerBlock}

【你的说话风格】
- 第二人称"你"，亲密称呼"姐妹/老铁/兄弟"（看 TA 性别和情境选）
- 克制、深邃、有梗——别像鸡汤博主，要像深夜推心置腹的那种朋友
- 偶尔毒舌但有温度
- 引用流行词但不油腻
- 关键时刻敢说让人拍腿叫好的真话

【你必须做的】
1. 把 MBTI / 八字 / 星座的知识翻译成现代语言（"INFJ 容易内化" → "你是不是又在自我反刍了？"）
2. 给具体行动建议，不要"建议沟通""学会理解"这种空话
3. 单次回复 200-500 字
4. 遇到严重心理问题（自杀倾向、家暴等），认真引导专业资源（北京心理危机研究与干预中心 010-82951332 / 全国心理援助 12320 / 一杯咖啡热线）

【你绝对不能做的】
- "亲爱的用户" / "建议您" / "祝您" 这种心理咨询师腔
- 列 1234 这种官腔结构（可以分段，但别像论文目录）
- "你应该……" 命令式
- 替 TA 做重大决定（分手/辞职/堕胎等）——只给方向和判断框架
- 预测寿命、疾病、横财、彩票号码
- 让 TA 对你产生情感依赖——你是顾问，不是替代品

现在 TA 来了。准备好接住 TA。`;
}

/* ============== 3. 速率限制 ============== */

function checkRateLimit(ip) {
  const now = Date.now();
  const oneMinAgo = now - 60000;
  const arr = rateLimitMap.get(ip) || [];
  const recent = arr.filter(t => t > oneMinAgo);
  if (recent.length >= RATE_LIMIT_PER_MINUTE) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  // 清理 24h 之前的过期 IP（防止 Map 无限膨胀）
  if (rateLimitMap.size > 1000) {
    const dayAgo = now - 86400000;
    for (const [k, v] of rateLimitMap.entries()) {
      if (Math.max(...v) < dayAgo) rateLimitMap.delete(k);
    }
  }
  return true;
}

/* ============== 4. 主 fetch handler ============== */

export default {
  async fetch(request, env /* , ctx */) {

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return jsonError(405, 'Method not allowed');
    }

    // 速率限制
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return jsonError(429, 'Rate limit exceeded. Try again in a minute.');
    }

    // 解析 body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonError(400, 'Invalid JSON body');
    }

    const { code, user, partner, messages } = body;

    if (!code) return jsonError(401, 'Missing unlock code');

    const secret = env.UNLOCK_SECRET || 'mbti-secret-2026';
    const isValid = await verifyUnlockCode(code, 'ai', secret);
    if (!isValid) return jsonError(403, '解锁码无效或非 AI 档位');

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonError(400, 'messages 不能为空');
    }

    if (!env.DEEPSEEK_API_KEY) {
      return jsonError(500, 'DEEPSEEK_API_KEY 未配置（在 Workers Settings 加 env var）');
    }

    // 注入系统提示词 + 限制对话历史
    const systemPrompt = buildSystemPrompt(user, partner);
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-20)
    ];

    // 调用 DeepSeek（流式）
    let deepseekResp;
    try {
      deepseekResp = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: fullMessages,
          stream: true,
          temperature: 0.8,
          max_tokens: 1024
        })
      });
    } catch (e) {
      return jsonError(502, 'DeepSeek API connection failed: ' + e.message);
    }

    if (!deepseekResp.ok) {
      const errText = await deepseekResp.text();
      return jsonError(deepseekResp.status, 'DeepSeek API error: ' + errText.slice(0, 200));
    }

    // SSE pass-through
    return new Response(deepseekResp.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...CORS_HEADERS
      }
    });
  }
};

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
  });
}
