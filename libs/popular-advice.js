/*!
 * libs/popular-advice.js — 流行梗式相处建议库
 * --------------------------------------------------------------
 * 命名空间：window.POPULAR_ADVICE
 *
 * 结构：
 *   general[]  — 通用建议（50+ 条）；每条 { id, title, content, keywords[] }
 *   typed{}    — MBTI 双方组合特化建议（30+ 组）；每组是 advice 数组
 *
 * 文风（延续 P1 / matching-data 灵魂版）：
 *   - 标题用流行梗短语（"建立松弛感" / "课题分离" / "情绪价值供应"）
 *   - 正文给具体行动（"每周三晚上的'夸夸时间'，5 分钟"）
 *   - 拒绝空话（"建立良好沟通" / "多陪伴对方"）
 *   - 关键时刻敢说"别勉强了"
 *
 * 配套（在 matching-engine.js 实现）：
 *   selectAdvice(personA, personB, matchSnapshot) → 选 5-8 条最相关
 */
(function () {
  'use strict';

  /* ========================================================================
   * 1. 通用建议（55 条，覆盖所有场景）
   * ====================================================================== */

  const general = [
    {
      id: 'song_chi_gan',
      title: '建立松弛感',
      content: 'TA 不需要你 24 小时报备，给 TA 独处的下午茶时光。每天问"在哪？跟谁？什么时候回？" 三连，是在把爱情过成审讯室。',
      keywords: ['黏人', '焦虑', '查岗', '安全感']
    },
    {
      id: 'ke_ti_fen_li',
      title: '课题分离',
      content: 'TA 妈的事是 TA 和 TA 妈的事，你掺和进去就是越界。婆媳关系最伤的不是直接冲突，是丈夫站错位。一句话：让 TA 处理 TA 的家人。',
      keywords: ['婆媳', '家庭', '矛盾', 'mamababy']
    },
    {
      id: 'qing_xu_jia_zhi',
      title: '情绪价值供应',
      content: '每周三晚上的"夸夸时间"——5 分钟，认真夸对方一件具体的事。比送包好用，因为这是 TA 唯一记得的"被看见"。',
      keywords: ['浪漫', '仪式感', '夸赞']
    },
    {
      id: 'gao_zhi_liang_di_pin',
      title: '高质量低频沟通',
      content: '吵架不过夜，但可以分床睡——给彼此 8 小时冷静。情绪在的时候说出来的话，80% 都会后悔。睡醒后再谈，省了 30% 的伤害。',
      keywords: ['吵架', '冷战', '沟通']
    },
    {
      id: 'pua_red_flag',
      title: '识别 PUA 红旗',
      content: 'TA 说"是你想太多"超过 3 次，那就不是你想太多。PUA 不是大喊大叫，是温水煮青蛙——让你越来越不信任自己的判断。',
      keywords: ['pua', '贬低', '控制']
    },
    {
      id: 'qin_mi_nei_hao',
      title: '亲密关系内耗',
      content: '如果在一起需要装一个"更好的自己"，就不要在一起了。装久了不是不累，是你已经感觉不到累——直到某一天彻底空了。',
      keywords: ['假装', '委屈', '内耗']
    },
    {
      id: 'qing_gan_le_suo',
      title: '情感勒索识别',
      content: '用"为你好"当遥控器的人，要警惕。真正为你好的人不会一边为你好一边让你内疚——TA 们会问你"你想要什么"，而不是替你决定。',
      keywords: ['道德绑架', '勒索', 'pua']
    },
    {
      id: 'fu_xian_jie_qing',
      title: '复现节庆仪式',
      content: '每年纪念日就算只在便利店吃关东煮，也要去。感情不是靠一次大爆发，是靠 365 次小坚持。仪式感是关系的钉子，少几颗都松。',
      keywords: ['仪式感', '保鲜', '纪念日']
    },
    {
      id: 'bu_xiu_fu_dui_fang',
      title: '拒绝"修复对方"',
      content: '你不是 TA 的咨询师。爱上一个"需要被修好"的人，最后大概率两个人都坏了。如果 TA 不愿意自己面对，再爱也救不了。',
      keywords: ['拯救者', '边界', '消耗']
    },
    {
      id: 'qian_de_bian_jie',
      title: '设定金钱边界',
      content: 'AA 还是包养，说清楚。模糊的钱关系是关系里最容易引爆的雷。3 个月聊一次"我们的钱怎么算"，比 30 岁分家产省事 100 倍。',
      keywords: ['钱', '边界', 'AA', '财务']
    },
    {
      id: 'bu_dai_pao_dao_qian',
      title: '不要替对方道歉',
      content: 'TA 跟 TA 妈吵，你别夹在中间道歉。你的工作是站 TA 这边，不是当裁判。夹中间的伴侣会两边不讨好。',
      keywords: ['婆媳', '家庭', '中间人']
    },
    {
      id: 'jia_zhi_di_xian',
      title: '价值观底线',
      content: '想清楚 3 件你不能让步的事——可能是孩子要不要打、要不要还房贷、要不要离开父母身边。3 件，写下来。低于这 3 件的事，都可以谈。',
      keywords: ['底线', '原则', '不妥协']
    },
    {
      id: 'zhou_yi_hui_yi',
      title: '周一会议',
      content: '每周固定一个 15 分钟谈"这周我们怎么样"。不是吵架，是 review。这一个习惯能让关系寿命延长至少 5 年。',
      keywords: ['沟通', '周会', '仪式感']
    },
    {
      id: 'wu_fen_zhong_chao_jia_fa',
      title: '五分钟争吵法',
      content: '吵架开始前定一个 5 分钟倒计时——闹钟响了就停，互相一个拥抱。情绪有出口但不失控。情侣里实测有效。',
      keywords: ['吵架', '冷战', '情绪管理']
    },
    {
      id: 'ling_hun_zhang_hu',
      title: '灵魂账户',
      content: '每月做一件给对方的"灵魂事"——不是送礼物，是听 TA 聊一件 TA 在意但你不感兴趣的事，听满 30 分钟不打断。这是真的爱。',
      keywords: ['倾听', '深度', '在意']
    },
    {
      id: 'ju_jue_leng_zhan',
      title: '拒绝冷战',
      content: '不说就是同意的暴政。冷战最伤的不是吵架的 3 天，是 5 年后回头看积压了多少没说出口的事。直接吵，比冷战温柔 10 倍。',
      keywords: ['冷战', '吵架', '沉默']
    },
    {
      id: 'qing_xu_ji_zhang',
      title: '情绪记账',
      content: '别都攒着。心里不舒服的瞬间就说出来——"今天那句话让我有点难过"。攒到爆的时候，已经救不回了。',
      keywords: ['沟通', '吵架', '积压']
    },
    {
      id: 'gong_tong_mi_ma',
      title: '共同密码',
      content: '约定一个只有你俩懂的暗号——比如吵到极限时一方说"暂停"，另一方必须停。这是关系里最便宜也最有效的安全阀。',
      keywords: ['吵架', '暗号', '安全']
    },
    {
      id: 'kua_qing_jing_yong_bao',
      title: '跨情境拥抱',
      content: '不是只在睡前拥抱。早晨刷牙时、回家进门时、TA 看手机时——多个 5 秒拥抱。皮肤记得的爱，比嘴说的爱长。',
      keywords: ['亲密', '肢体', '日常']
    },
    {
      id: 'jie_shou_dao_tui',
      title: '接受关系倒退',
      content: '关系不是一直往前的。第 5 年可能不如第 2 年甜，第 10 年又比第 5 年深。承认 valley 的存在，不要每次低谷都怀疑"是不是不爱了"。',
      keywords: ['长期', '倒退', '平稳']
    },
    {
      id: 'po_xi_zhan_lue',
      title: '婆媳战略',
      content: '你的爹妈是你处理的，TA 的爹妈是 TA 处理的。这是金科玉律。一旦交叉处理，第一年合家欢，第 5 年大家庭核战。',
      keywords: ['婆媳', '家庭', '边界']
    },
    {
      id: 'qian_bu_shi_dui_shou',
      title: '钱不是爱情的对手',
      content: '钱是工具，不是敌人。讲钱不丢人，回避讲钱才是。每年一次"我们的钱"对话——账户、债务、目标、风险，全部摊开。',
      keywords: ['钱', '理财', '透明']
    },
    {
      id: 'bu_jiao_zuo_ren',
      title: '不要试图教对方做人',
      content: '你不是 TA 妈。每次想说"你应该……"之前，先问自己——这是必须改的，还是我看不顺眼？多数答案是后者。',
      keywords: ['控制', '改造', '边界']
    },
    {
      id: 'san_ming_zhi_fa_ze',
      title: '三明治法则',
      content: '批评夹在两次肯定中——"你这点我特别喜欢；不过那件事下次可以这样；总的来说我很感谢你"。难听话听起来才会进。',
      keywords: ['沟通', '批评', '技巧']
    },
    {
      id: 'zhou_mo_chou_ti',
      title: '周末抽屉',
      content: '每周留一个不谈正事的下午——不谈钱、不谈孩子、不谈父母、不谈工作。就喝咖啡、聊废话、看 TA 笑。这是关系的"维生素 C"。',
      keywords: ['仪式感', '保鲜', '日常']
    },
    {
      id: 'zhi_jie_shuo_nan_guo',
      title: '直接说"我难过"',
      content: '别绕弯子。"你都不在乎我"是绕弯子，"我现在很难过，希望你抱抱我"是直接。后者永远比前者管用。',
      keywords: ['表达', '需求', '沟通']
    },
    {
      id: 'bu_fa_en_o',
      title: '不发"嗯""哦"',
      content: '这是冷暴力的入门级。看见 TA 发"嗯""哦"超过 3 次，先问自己——是不是我刚才那条让 TA 不舒服了？及时止血比事后修补省事。',
      keywords: ['沟通', '冷暴力', '微信']
    },
    {
      id: 'gong_tong_zhang_hu_zheng_zhi',
      title: '共同账户的政治',
      content: '建议设 3 个账户——你的、TA 的、共同的。共同账户的钱怎么花，每月一次对账。一笔小钱看清谁更慷慨，比一次大讨论有用。',
      keywords: ['钱', '账户', '透明']
    },
    {
      id: 'bu_rang_dui_fang_cai',
      title: '不让对方猜',
      content: 'TA 不是读心师。你饿了说"我饿了"，你委屈了说"我委屈"，你想要拥抱说"抱我"。"你应该懂我"是关系毒药。',
      keywords: ['表达', '猜', '沟通']
    },
    {
      id: 'jing_ti_xi_guan',
      title: '警惕"我都习惯了"',
      content: '习惯不等于幸福。如果你最近一个月想说的话是"我都习惯了 TA 这样"，停下来想——是真的接受了，还是已经麻木了？',
      keywords: ['长期', '麻木', '反思']
    },
    {
      id: 'dan_du_yue_hui',
      title: '一周一次单独约会',
      content: '哪怕在家——也要"约会"。穿一件平时不穿的衣服，做一顿不是日常的饭，关掉手机 2 小时。仪式感的不仅是节日，更是日常。',
      keywords: ['仪式感', '保鲜', '约会']
    },
    {
      id: 'bu_zai_peng_you_qian_bian_di',
      title: '不在朋友面前贬低对方',
      content: '即使是开玩笑。"我家那位什么都不懂"听起来像段子，TA 心里记 30 年。要吐槽，关起门来。',
      keywords: ['尊重', '社交', '面子']
    },
    {
      id: 'dao_qian_san_ceng',
      title: '道歉的三层',
      content: '承认（"我错了"）、共情（"你一定很难过"）、改变（"下次我会……"）。光说"对不起"是耍流氓，三层全到位才叫道歉。',
      keywords: ['吵架', '道歉', '修复']
    },
    {
      id: 'bu_xiang_zi_ji_de_shi',
      title: '偶尔做"不像自己"的事',
      content: '永远做自己会让关系沉闷。每月做一件 TA 喜欢但你不喜欢的事——不为讨好，为了让 TA 觉得"被在乎"。这一件事顶 10 句"我爱你"。',
      keywords: ['让步', '在乎', '保鲜']
    },
    {
      id: 'gei_cheng_zhang_kong_jian',
      title: '给彼此成长留空间',
      content: 'TA 在变化不是背叛你。如果 TA 30 岁的你跟 25 岁的你一样，那才该担心。关系里最危险的不是对方变了，是你不允许对方变。',
      keywords: ['成长', '变化', '允许']
    },
    {
      id: 'yi_nian_yi_ci_shen_du',
      title: '一年一次深度对话',
      content: '每年一次，找一个晚上，问彼此一个问题——"我想要的我们，是什么样的？" 这个问题问 10 年，关系会越问越深。',
      keywords: ['深度', '年度', '反思']
    },
    {
      id: 'bu_yao_ying_gai',
      title: '不要把对方放进"应该"',
      content: '"男生应该……女生应该……" 这种句式开头，关系就开始死了。让 TA 是 TA，不是 TA 的角色。',
      keywords: ['性别', '角色', '应该']
    },
    {
      id: 'jing_ti_peng_you_du_chi',
      title: '警惕"我们朋友都这样"',
      content: '别拿别人的尺量你们。XX 老婆带娃、XX 老公赚多少——这种比较是关系毒药。你们的关系只跟你们俩有关。',
      keywords: ['比较', '社交', '焦虑']
    },
    {
      id: 'zhi_jie_biao_da_xu_qiu',
      title: '直接表达需求',
      content: '"我想 X" 比 "你应该 X" 管用 10 倍。前者是邀请，后者是命令。能用前者的关系比能用后者的关系长 20 年。',
      keywords: ['表达', '需求', '沟通']
    },
    {
      id: 'xing_bu_shi_wu_qi',
      title: '不要把性当武器',
      content: '也不要当筹码。性是亲密的一部分，不是用来惩罚或交换的工具。一旦工具化，关系里最珍贵的那块就坏了。',
      keywords: ['亲密', '性', '武器']
    },
    {
      id: 'ya_que_bu_biao_da',
      title: '接受"不爱表达"',
      content: '但要求 TA 偶尔表达。每月一次"今天告诉我一句你心里的话"——可以是好的，可以是抱怨的，可以是无关紧要的。表达的肌肉需要练。',
      keywords: ['表达', '沉默', '练习']
    },
    {
      id: 'zi_ji_xian_kuai_le',
      title: '自己先快乐',
      content: '你不快乐 TA 也累。别把"幸福"全部押在对方身上——TA 也不是你的客服。自己先有快乐的能力，才能把多余的分给 TA。',
      keywords: ['独立', '快乐', '自我']
    },
    {
      id: 'xue_yi_xiang_ta_xi_huan',
      title: '学一项 TA 喜欢的事',
      content: '不为讨好，为了解。学打 TA 喜欢的桌游、看一遍 TA 推荐的电影。10 年后你会感谢这些"无关的事"——它们是你们最大的共同语言。',
      keywords: ['共同', '兴趣', '了解']
    },
    {
      id: 'bu_yao_hu_ran_ai_de_hong_zha',
      title: '不要忽然的"爱的轰炸"',
      content: '平稳的爱比突袭的爱长久。每天 5 分钟陪伴，胜过每月一次惊喜大礼。爱不是过山车，是恒温浴室。',
      keywords: ['平稳', '日常', '保鲜']
    },
    {
      id: 'san_ge_li_wu',
      title: '三个礼物',
      content: '你能给 TA 的最贵礼物——时间、注意力、不评价。比包、比表、比首饰都贵。给得起的人，是真爱。',
      keywords: ['礼物', '注意力', '深度']
    },
    {
      id: 'ku_de_quan_li',
      title: '哭的权利',
      content: '给彼此哭的空间。男生也能哭，女生不哭也行——别让性别决定情绪的合法性。哭过的关系，比从不哭的关系更亲。',
      keywords: ['情绪', '哭', '允许']
    },
    {
      id: 'wo_du_shi_wei_ni_hao',
      title: '不要"我都是为你好"',
      content: '这句话是关系毒药。每次想说出口前，先翻译成——"我希望你按我想的活"。如果你能接受这个翻译，再说；接受不了，就闭嘴。',
      keywords: ['控制', '为你好', '勒索']
    },
    {
      id: 'gong_tong_ji_zhang_ben',
      title: '共同记账本',
      content: '不只记钱，记开心的事。每月写下 5 件"我们一起做过让我开心的事"。这本子翻到第 10 年时，比相册还珍贵。',
      keywords: ['记录', '仪式感', '年度']
    },
    {
      id: 'yuan_li_qian_ren_dui_bi',
      title: '远离 TA 的过去对比',
      content: '不和 TA 的前任比较。"你怎么不能像 XX 那样" 是关系绞肉机。TA 选你不是因为你比 XX 强，是因为 TA 想要现在这个你。',
      keywords: ['前任', '比较', '安全感']
    },
    {
      id: 'ting_wan_zai_shuo',
      title: '听完再说',
      content: '不抢话不补刀。TA 说话的时候，看着 TA 的眼睛，听完，然后停 3 秒再回。这 3 秒是关系最重要的"修复时间"。',
      keywords: ['倾听', '尊重', '沟通']
    },
    {
      id: 'chang_qi_guan_xi_de_80_20',
      title: '长期关系的 80/20',
      content: '80% 平淡，20% 闪光。如果你期待 100% 闪光，5 年内必散。日常的细碎才是关系的本体，闪光是奖金不是工资。',
      keywords: ['长期', '平淡', '期望']
    },
    {
      id: 'jie_shou_wu_liao',
      title: '接受"无聊"是常态',
      content: '浪漫是奖金。30 岁后还每周浪漫的，要么没在一起多久，要么在演给别人看。真正的爱在很多个"周三晚上一起洗碗"的安静里。',
      keywords: ['平淡', '日常', '稳定']
    },
    {
      id: 'yi_ju_hua_bao_ming',
      title: '一句话保命',
      content: '吵到失控时直接说——"我现在需要一个拥抱"。比讲道理、比道歉、比沉默都有效。前提是你们都同意这句话不算认输。',
      keywords: ['吵架', '拥抱', '修复']
    },
    {
      id: 'bu_rang_yuan_sheng',
      title: '不让原生家庭决定一切',
      content: '你们是新家庭。原生家庭给你模板，但不应该决定你和 TA 怎么活。每 6 个月问一次——"我们这个版本的家，跟我爹妈那个版本，哪里不一样？"',
      keywords: ['家庭', '原生', '独立']
    },
    {
      id: 'bu_yao_zai_deadline_tan_qing',
      title: '不在 deadline 时谈感情',
      content: '你最累、TA 最忙的时候，最不该谈"我们的关系"。状态差时不做决定。等 3 天，再开口。3 天后你说的话会和 3 天前完全不一样。',
      keywords: ['时机', '吵架', '决定']
    }
  ];

  /* ========================================================================
   * 2. 类型组合特化建议（32 组高频 MBTI 配对）
   * 命名：'MBTI_A_MBTI_B'，selectAdvice 会双向匹配
   * ====================================================================== */

  const typed = {

    /* ---------- 黄金搭档（互补功能配对 × 8 对 = 16 个方向） ---------- */

    'INFJ_ENFP': [
      {
        id: 'infj_enfp_1',
        title: '深邃 × 跳跃 的搭配',
        content: 'INFJ 喜欢深聊，ENFP 喜欢跳话题。约定：每周一次 2 小时深聊（INFJ 主），每周一次 3 小时瞎玩（ENFP 主）。不互相教育，各享受各的。',
        keywords: ['INFJ', 'ENFP', '深度', '广度']
      }
    ],
    'INFJ_ENTP': [
      {
        id: 'infj_entp_1',
        title: '哲学家 × 杠精 的对话',
        content: 'ENTP 喜欢辩论，INFJ 容易把辩论当成"你在否定我"。规则：辩论时间限定 30 分钟，30 分钟后必须切话题。否则 INFJ 会消失 3 天。',
        keywords: ['INFJ', 'ENTP', '辩论', '边界']
      }
    ],
    'INTJ_ENFP': [
      {
        id: 'intj_enfp_1',
        title: '冷规划 × 热冲动',
        content: 'INTJ 列年度计划，ENFP 想到哪做到哪。妥协：ENFP 给 INTJ 一个"必须执行的目标"，INTJ 给 ENFP 一段"完全没计划的周末"。',
        keywords: ['INTJ', 'ENFP', '计划', '即兴']
      }
    ],
    'INTJ_ENTP': [
      {
        id: 'intj_entp_1',
        title: '战略家 × 创意人',
        content: 'INTJ 设系统，ENTP 找漏洞。这是 16 型里最像"创业搭档"的组合。在感情里也用这个模式：INTJ 定规则，ENTP 偶尔打破。',
        keywords: ['INTJ', 'ENTP', '战略', '创意']
      }
    ],
    'INFP_ENFJ': [
      {
        id: 'infp_enfj_1',
        title: '内在世界 × 外在领袖',
        content: 'INFP 守住真实，ENFJ 影响他人。约定：ENFJ 不试图把 INFP 变成"更外向的人"。INFP 接受 ENFJ 偶尔的"社交需求"，不要 sulk。',
        keywords: ['INFP', 'ENFJ', '改造', '边界']
      }
    ],
    'INFP_ESFJ': [
      {
        id: 'infp_esfj_1',
        title: '诗人 × 邻家姐姐',
        content: 'INFP 在情绪低谷时需要空间，ESFJ 的本能是"我要去看 TA"。约定：低谷时 INFP 主动说"我需要 3 天独处"，ESFJ 把关心留到第 4 天。',
        keywords: ['INFP', 'ESFJ', '空间', '低谷']
      }
    ],
    'ISFP_ENFJ': [
      {
        id: 'isfp_enfj_1',
        title: '随性 × 计划性',
        content: 'ISFP 不喜欢"被安排"，ENFJ 喜欢"我已经为你想好了"。这种关系最怕 ENFJ 把照顾变成控制。规则：ENFJ 提建议，ISFP 决定要不要采纳，不强求。',
        keywords: ['ISFP', 'ENFJ', '控制', '随性']
      }
    ],
    'ISFP_ESFJ': [
      {
        id: 'isfp_esfj_1',
        title: '艺术家 × 持家者',
        content: 'ISFP 把生活过成感受，ESFJ 把生活过成秩序。共存的关键：ESFJ 不在 ISFP 的工作室里整理东西。ISFP 不在 ESFJ 的家庭聚会上当透明人。',
        keywords: ['ISFP', 'ESFJ', '秩序', '空间']
      }
    ],
    'ISTJ_ESTP': [
      {
        id: 'istj_estp_1',
        title: '老派 × 街头',
        content: 'ISTJ 觉得 ESTP 太冒险，ESTP 觉得 ISTJ 太保守。规则：每月一次 ESTP 带 ISTJ 做一件"刺激但不违法"的事，每月一次 ISTJ 带 ESTP 做一件"无聊但有意义"的事。',
        keywords: ['ISTJ', 'ESTP', '冒险', '稳定']
      }
    ],
    'ISTJ_ESFP': [
      {
        id: 'istj_esfp_1',
        title: '规矩人 × 派对人',
        content: 'ISTJ 想存钱，ESFP 想花钱。这是这对最大的潜在冲突。约定一个"享乐预算"——每月固定数额 ESFP 自由花，超过的需要商量。',
        keywords: ['ISTJ', 'ESFP', '钱', '消费']
      }
    ],
    'ISFJ_ESTP': [
      {
        id: 'isfj_estp_1',
        title: '温柔 × 直接',
        content: 'ISFJ 不愿"麻烦别人"，ESTP 听不懂暗示。如果你是 ISFJ，请直接说："今天我累了，能你做饭吗？" ESTP 会立刻答应——前提是你说出口。',
        keywords: ['ISFJ', 'ESTP', '表达', '直接']
      }
    ],
    'ISFJ_ESFP': [
      {
        id: 'isfj_esfp_1',
        title: '守护者 × 派对人',
        content: 'ISFJ 想留在家，ESFP 想出门。每周 1 次 ESFP 带 ISFJ 出门（哪怕是楼下散步），每周 1 次 ISFJ 拽 ESFP 一晚不刷手机。',
        keywords: ['ISFJ', 'ESFP', '社交', '陪伴']
      }
    ],
    'INTP_ENTJ': [
      {
        id: 'intp_entj_1',
        title: '思考者 × 行动者',
        content: 'INTP 想清楚再做，ENTJ 做了再说。约定：每个决定 ENTJ 给 INTP 24 小时思考，超过 24 小时 ENTJ 有权独断。这是平衡两种节奏的金句。',
        keywords: ['INTP', 'ENTJ', '决策', '节奏']
      }
    ],
    'INTP_ESTJ': [
      {
        id: 'intp_estj_1',
        title: '懒理论家 × 实干派',
        content: 'INTP 觉得 ESTJ "太死板"，ESTJ 觉得 INTP "光说不做"。规则：INTP 负责出方案，ESTJ 负责执行。明确分工后，是 16 型里最稳的合伙关系。',
        keywords: ['INTP', 'ESTJ', '分工', '执行']
      }
    ],
    'ISTP_ENTJ': [
      {
        id: 'istp_entj_1',
        title: '匠人 × 将军',
        content: 'ISTP 不爱被管，ENTJ 不爱被晾。规则：ENTJ 不细管 ISTP 的具体做法，只看结果。ISTP 完成 ENTJ 设定的结果，过程自由。',
        keywords: ['ISTP', 'ENTJ', '自由', '结果']
      }
    ],
    'ISTP_ESTJ': [
      {
        id: 'istp_estj_1',
        title: '冷静技术 × 务实管理',
        content: 'ISTP 喜欢独自解决问题，ESTJ 喜欢"团队作战"。家庭里：让 ISTP 负责修东西/规划设备，ESTJ 负责协调亲友/管理日程。各取所长。',
        keywords: ['ISTP', 'ESTJ', '分工', '务实']
      }
    ],

    /* ---------- 同型配对（10 组） ---------- */

    'INFJ_INFJ': [
      {
        id: 'infj_infj_1',
        title: '两个 INFJ 的双向消失',
        content: '两个 INFJ 在一起的最大风险——同时陷入深度思考，3 天不说话。约定一个"打破沉默暗号"，比如"我想你了"。其中一方说出口，两边都解套。',
        keywords: ['INFJ', '沉默', '深度']
      }
    ],
    'INTJ_INTJ': [
      {
        id: 'intj_intj_1',
        title: '双 INTJ 的项目化人生',
        content: '两个 INTJ 把感情过成项目管理，5 年下来变成"高效室友"。每月一次"放下表格"的日子——不规划、不分析、不优化。就一起发呆。',
        keywords: ['INTJ', '项目化', '感性']
      }
    ],
    'ENFP_ENFP': [
      {
        id: 'enfp_enfp_1',
        title: '双 ENFP 的烟花永动机',
        content: '两个 ENFP 在一起前 3 个月是天堂，3 个月后两个人都开始想"下一个新鲜事"。约定一个"长期项目"——一起养一盆植物 1 年、一起读完一本书——给关系一根锚。',
        keywords: ['ENFP', '新鲜', '稳定']
      }
    ],
    'ENTJ_ENTJ': [
      {
        id: 'entj_entj_1',
        title: '双 ENTJ 的权力斗争',
        content: '两个 ENTJ 在一起，第一年比谁更强，第二年开始竞争。规则：分领域 — 一个管事业，一个管家。如果两个都想管事业，那就分公司。',
        keywords: ['ENTJ', '权力', '分工']
      }
    ],
    'INFJ_INFP': [
      {
        id: 'infj_infp_1',
        title: '深邃 × 真实',
        content: 'INFJ 想"看透"，INFP 想"守住"。INFJ 不要试图分析 INFP 的所有反应，INFP 不要因为 INFJ 一句话就 3 天怀疑人生。各留一点不被理解的余地。',
        keywords: ['INFJ', 'INFP', '理解', '边界']
      }
    ],
    'INFJ_INTJ': [
      {
        id: 'infj_intj_1',
        title: '情商 × 智商',
        content: 'INFJ 看见 INTJ 的"冷"背后的"在意"，INTJ 看见 INFJ 的"敏感"背后的"洞察"。这种关系是 16 型里少数能彼此完全看穿的。前提：INTJ 偶尔说一句"我懂"，INFJ 偶尔说一句"我没事"。',
        keywords: ['INFJ', 'INTJ', '深度']
      }
    ],
    'INTJ_INFP': [
      {
        id: 'intj_infp_1',
        title: '战略 × 诗意',
        content: 'INTJ 总想给 INFP "理性建议"，INFP 总想让 INTJ "感受一下"。规则：INTJ 给建议前先听完，INFP 接受 INTJ 的"建议"不是"否定"。',
        keywords: ['INTJ', 'INFP', '理性', '感性']
      }
    ],
    'ENTP_INTP': [
      {
        id: 'entp_intp_1',
        title: '段子手 × 思辨者',
        content: 'ENTP 把所有事变成段子，INTP 把所有事变成理论。两个人在一起最容易"聊一晚上不睡觉"。但日常生活——谁洗碗谁去交水电费——两人都不爱做。建议雇个阿姨或定下硬规则。',
        keywords: ['ENTP', 'INTP', '生活', '务实']
      }
    ],
    'ESFP_ISFP': [
      {
        id: 'esfp_isfp_1',
        title: '外放 × 内敛',
        content: '同为 SFP，都活在当下、都重感受。区别是 ESFP 要观众，ISFP 不要。规则：ESFP 在外面发光，ISFP 在家做后盾。两人不抢戏，关系最稳。',
        keywords: ['ESFP', 'ISFP', '社交']
      }
    ],
    'ENFJ_ENFJ': [
      {
        id: 'enfj_enfj_1',
        title: '双 ENFJ 的过度付出',
        content: '两个 ENFJ 在一起，互相照顾到忘了自己。每月一次"什么都不做"的日子——不联系、不见面、不关心。给彼此一天独自的空间。',
        keywords: ['ENFJ', '付出', '独处']
      }
    ],

    /* ---------- 其他常见配对（6 组） ---------- */

    'ENTJ_INFJ': [
      {
        id: 'entj_infj_1',
        title: '将军 × 哲学家',
        content: 'ENTJ 想行动，INFJ 想理解。两人差异最大的是"先做还是先想"。约定：重大事先想（INFJ 主），小事先做（ENTJ 主）。分工明确不内耗。',
        keywords: ['ENTJ', 'INFJ', '行动', '思考']
      }
    ],
    'ESFJ_INTJ': [
      {
        id: 'esfj_intj_1',
        title: '邻家姐姐 × 冷战略家',
        content: 'ESFJ 关心 INTJ 的一切，INTJ 觉得"被监控"。规则：ESFJ 学会"主动忽视" INTJ 的状态，给 INTJ 自我充电的时间。INTJ 学会主动汇报，让 ESFJ 放心。',
        keywords: ['ESFJ', 'INTJ', '关心', '空间']
      }
    ],
    'INTJ_ENFJ': [
      {
        id: 'intj_enfj_1',
        title: '冷战略 × 暖煽动',
        content: 'INTJ 看不上 ENFJ 的"过度共情"，ENFJ 看不到 INTJ 的"隐藏关心"。约定：ENFJ 不要逼 INTJ 表达感情，INTJ 用"行动"表达，ENFJ 学会读"行动语言"。',
        keywords: ['INTJ', 'ENFJ', '表达', '感情']
      }
    ],
    'ENFP_INFP': [
      {
        id: 'enfp_infp_1',
        title: '外放诗人 × 内敛诗人',
        content: '都是 NFP，都重感受、都想真实。但 ENFP 需要外部刺激，INFP 需要内部独处。规则：ENFP 出门 high 之后不要拉 INFP，INFP 独处之后主动跟 ENFP 分享。',
        keywords: ['ENFP', 'INFP', '社交', '独处']
      }
    ],
    'ESTJ_ESFJ': [
      {
        id: 'estj_esfj_1',
        title: '董事会 × 邻家姐姐',
        content: '都是 EJ，都爱"管事"。两人都想当家会矛盾。分工：ESTJ 管对外（事业/财务），ESFJ 管对内（家庭/人际）。各立王国不互相干涉。',
        keywords: ['ESTJ', 'ESFJ', '分工', '管事']
      }
    ],
    'ESTP_ESFP': [
      {
        id: 'estp_esfp_1',
        title: '冒险家 × 派对王',
        content: '都是 ESP，都活在当下、都爱玩。但 ESTP 玩"刺激"，ESFP 玩"热闹"。每个月一次妥协：一晚 ESTP 拽 ESFP 去蹦极/极限运动，一晚 ESFP 拽 ESTP 去 KTV / 派对。',
        keywords: ['ESTP', 'ESFP', '玩', '差异']
      }
    ]
  };

  /* ========================================================================
   * 3. 对外暴露
   * ====================================================================== */

  window.POPULAR_ADVICE = { general, typed };
})();
