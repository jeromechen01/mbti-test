/**
 * match-score.js — 找搭子 · 匹配度算法
 * ============================================================================
 * 匹配度(0-100) = MBTI 互补(40) + 搭子标签重合(40) + 出生地缘分(10) + 随机缘分(10)
 *
 * 纯函数、无副作用、不依赖 DOM。
 * 🔒 隐私：只吃匿名画像字段（baseCode / sceneTags / buddyMainTag / province / city）。
 *    绝不接触 phone / email / 密码 —— 调用方查询 Supabase 时也不要 select 这些字段。
 *
 * 用法：
 *   const r = window.MatchScore.compute(me, other)
 *   me / other = {
 *     id:           'uuid',            // 用于稳定随机分（不展示）
 *     baseCode:     'ENFP',            // 4 字母（不含 A/T 后缀也可，自动取前 4 位）
 *     sceneTags:    ['meal','study'],  // 场景副标签 key 数组
 *     buddyMainTag: '气氛搭子',         // 主标签名（同款 +分）
 *     province:     '广东',            // 选填，没有则该项 0 分
 *     city:         '广州'             // 选填
 *   }
 *   r = {
 *     total, mbti, tags, region, random,   // 各分项
 *     sharedSceneTags: ['meal'],           // 共同场景标签（用于高亮）
 *     reason: { zh, en }                   // 一句破冰建议
 *   }
 * ============================================================================
 */
(function () {
  'use strict';

  /* ---------- 1. MBTI 互补（0-40）----------
   * 思路（搭子场景，非恋爱）：互补但有共识者更易现场破冰。
   *   E/I 互补 → 一动一静好搭话；S/N 相同 → 共同世界观聊得来；
   *   T/F 适度互补；J/P 互补 → 一个推进一个灵活。
   * 再用 BUDDY_MATCH（已校准的 best/clash 类型兼容关系）做覆盖修正。
   * 4 字母顺序：[0]=E/I  [1]=S/N(写 N 或 S)  [2]=T/F  [3]=J/P
   */
  function letterScore(a, b) {
    if (!a || !b || a.length < 4 || b.length < 4) return 24;
    const A = a.toUpperCase(), B = b.toUpperCase();
    let s = 0;
    s += (A[0] !== B[0]) ? 11 : 8;   // E/I 互补更易破冰
    s += (A[1] === B[1]) ? 11 : 6;   // S/N 相同 → 共同世界观
    s += (A[2] !== B[2]) ? 10 : 8;   // T/F 适度互补
    s += (A[3] !== B[3]) ? 8  : 6;   // J/P 互补 → 一推进一灵活
    return s;                         // 约 28-40
  }

  function mbtiScore(meBase, otherBase) {
    const me4 = (meBase || '').slice(0, 4);
    const ot4 = (otherBase || '').slice(0, 4);
    let s = letterScore(me4, ot4);
    // 用 BUDDY_MATCH 的 best / clash 关系覆盖（若已加载）
    const m = (typeof window !== 'undefined' && window.BUDDY_MATCH) ? window.BUDDY_MATCH[me4] : null;
    if (m) {
      if (m.best && m.best.some(x => x.code === ot4)) s = Math.max(s, 38);  // 最配 → 拉高
      if (m.clash && m.clash.code === ot4)            s = Math.min(s, 18);  // 最难处 → 压低
    }
    return Math.max(0, Math.min(40, Math.round(s)));
  }

  /* ---------- 2. 搭子标签重合（0-40）----------
   * 每个共同场景标签 12 分；主标签（搭子人设）相同额外 +10。封顶 40。
   */
  function tagScore(meTags, otherTags, meMain, otherMain) {
    const setB = new Set(otherTags || []);
    const shared = (meTags || []).filter(t => setB.has(t));
    let s = shared.length * 12;
    if (meMain && otherMain && meMain === otherMain) s += 10;
    return { score: Math.max(0, Math.min(40, s)), shared };
  }

  /* ---------- 3. 出生地缘分（0-10）----------
   * 同市 +10，同省 +5，否则 0。当前注册未采集城市时该项为 0（加了城市字段即自动生效）。
   */
  function regionScore(me, other) {
    if (me.city && other.city && me.city === other.city) return 10;
    if (me.province && other.province && me.province === other.province) return 5;
    return 0;
  }

  /* ---------- 4. 随机缘分（0-10）----------
   * 按两人 id 稳定哈希（同一对每次结果一致，刷新不乱跳），制造"命中注定"的惊喜感。
   */
  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }
  function randomScore(meId, otherId) {
    const key = [String(meId || ''), String(otherId || '')].sort().join('|');
    return hashStr(key) % 11;   // 0-10 稳定
  }

  /* ---------- 破冰建议 ---------- */
  function sceneMeta(key) {
    return (typeof window !== 'undefined' && window.SCENE_TAGS && window.SCENE_TAGS[key]) || null;
  }
  function sceneLabel(key, lang) {
    const st = sceneMeta(key);
    if (!st) return key;
    return ((st[lang] || st.zh) || {}).name || key;
  }
  function buildReason(shared, meMain, otherMain, total) {
    if (shared.length) {
      const k = shared[0];
      const emoji = (sceneMeta(k) || {}).emoji || '🤝';
      return {
        zh: `你们都是${emoji}${sceneLabel(k, 'zh')}，一起去尝今天的摊位吧！`,
        en: `You're both ${emoji}${sceneLabel(k, 'en')} — go try today's stalls together!`
      };
    }
    if (meMain && meMain === otherMain) {
      return { zh: '同款搭子人设，频率超对，凑一桌准没错！', en: 'Same buddy persona — instant wavelength, grab a table!' };
    }
    if (total >= 75) {
      return { zh: '互补度很高，聊起来基本不会冷场', en: 'Highly complementary — conversation won’t run dry' };
    }
    return { zh: '不同类型，正好互相打开新世界', en: 'Different types — open each other to new worlds' };
  }

  /* ---------- 主函数 ---------- */
  function compute(me, other) {
    me = me || {}; other = other || {};
    const mbti = mbtiScore(me.baseCode, other.baseCode);
    const tg = tagScore(me.sceneTags, other.sceneTags, me.buddyMainTag, other.buddyMainTag);
    const region = regionScore(me, other);
    const random = randomScore(me.id, other.id);
    const total = Math.max(0, Math.min(100, mbti + tg.score + region + random));
    return {
      total,
      mbti,
      tags: tg.score,
      region,
      random,
      sharedSceneTags: tg.shared,
      reason: buildReason(tg.shared, me.buddyMainTag, other.buddyMainTag, total)
    };
  }

  window.MatchScore = { compute: compute };
})();
