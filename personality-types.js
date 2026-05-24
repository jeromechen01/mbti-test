/*!
 * personality-types.js — 16 型人格百科
 * --------------------------------------------------------------
 * 数据结构：
 *   code            : 类型代码（如 'INFJ'）
 *   nameZh, nameEn  : 中英文名
 *   group           : 'NT' | 'NF' | 'SJ' | 'SP'
 *   themeColor      : 该类型主题色（与首页配色一致）
 *   tagline         : { zh, en } 一句话标签
 *   zh / en         : 八大 Tab 对应内容 + 关系数据
 *     - profile        : 性格画像
 *     - strengths      : 优势天赋
 *     - challenges     : 潜在挑战
 *     - loveLanguage   : 亲密关系（爱情）
 *     - friendship     : 友情
 *     - career         : 职业方向（推荐岗位 & 不适合）
 *     - workStyle      : 工作模式
 *     - communication  : 人际沟通
 *     - compatibleTypes / challengingTypes : 类型推荐
 *   growth          : { zh:{stage1,stage2,stage3}, en:{...} }  成长建议
 *   famousPeople    : 8 位名人（中外各半），{ nameZh, nameEn, titleZh, titleEn }
 *
 * 文风原则：
 *   - 温暖、专业、建设性
 *   - 不贴负面标签，弱点描述用"有时…"
 *   - 完全原创，禁止从任何 MBTI 网站复制
 */

window.PERSONALITY_TYPES = {

  /* ============================== NT 分析家族 ============================== */

  INTJ: {
    code: 'INTJ', nameZh: '建筑师', nameEn: 'Architect',
    group: 'NT', themeColor: '#4338CA',
    tagline: { zh: '战略思考者，在复杂里看见可能。', en: 'A strategist who sees possibility within complexity.' },
    zh: {
      profile: '建筑师是冷静的长期主义者。你习惯在脑海里搭建系统，拿到一个问题就一路追问"为什么"和"怎么改进"。当别人还在讨论现状时，你已经在反推三步以后的局面。独立、自律、对效率近乎苛刻——这是你的标签，也是你最常被误解的地方。',
      strengths: '能在信息有限的时候看出趋势；自我驱动，不靠外部监督；长跑型的事情上保持专注；决心一旦做出就很难被外界撼动；对自己和事物都有清晰的高标准。',
      challenges: '有时过于相信自己的判断，低估了"非理性因素"。容易显得疏远，被人误解为冷漠。完美主义可能让你迟迟不愿交付。亲近的人有时不知道你在想什么——情绪表达可以更主动一些。',
      loveLanguage: '在感情里看重灵魂层面的契合。比起浪漫姿态，你更在意对方能否跟你聊深。不擅长说情话，但会用行动表达——记得对方偏好、安排好生活的边角细节。需要警惕的是不要把伴侣"项目化"。',
      friendship: '朋友圈不大，但每一个都经过你的审慎挑选。愿意为真正的朋友投入时间和思考，但对浅层社交几乎不耐烦。和你做朋友需要给你独处空间——这不是冷漠，是你的充电方式。',
      career: '适合：战略咨询、产品架构师、研究员、风险分析、长期投资、CEO/CTO 这类需要长期视角与复杂建模的角色。不太适合：高频即兴社交、重复事务性工作、需要持续情感劳动的岗位。',
      workStyle: '独立、长程、深度。倾向于在小团队里推动复杂项目。做事前喜欢先建模，建好模再行动。给你目标但别给你过多过程指令——你会自己找到路径。',
      communication: '直接、简练、信息密度高。不喜欢绕弯子，也不喜欢被绕弯子。在亲近关系里需要刻意放慢，多解释一些判断过程，否则别人会觉得"你已经决定了"。',
      compatibleTypes: ['ENFP', 'ENTP'],
      challengingTypes: ['ESFP', 'ESFJ']
    },
    en: {
      profile: 'Architects are quiet long-term thinkers. You build systems in your head and instinctively ask "why" and "how could this be better." While others discuss the present, you are already three moves ahead. Independent, disciplined, and almost ruthless about efficiency — those are your signatures, and also where you are most often misread.',
      strengths: 'Strategic pattern recognition even with limited information; strong self-directed learning; long-distance focus; decisions, once made, hold steady against outside noise; clear high standards for both self and craft.',
      challenges: 'You sometimes over-trust your own judgment and underweight the irrational. You can come across as distant. Perfectionism can stall shipping. Even close people may not know what you are thinking — express more, more often.',
      loveLanguage: 'You seek soul-level alignment over romantic gestures. Sweet words come hard; care shows up in action — remembering preferences, smoothing logistical edges. Watch for the trap of treating your partner like a project.',
      friendship: 'Your circle is small but deliberately chosen. You invest time and thought in real friendships, with little patience for shallow rituals. Friendship with you means respecting your need to recharge alone — battery management, not coldness.',
      career: 'Fits: strategy consulting, product architecture, research, risk analysis, long-horizon investing, CEO/CTO roles requiring long-arc modeling and decision density. Less ideal: high-frequency improv-social work or roles built on constant emotional labor.',
      workStyle: 'Independent, long-arc, deep. You like to model before you act. Give you the goal, not the steps — you will find the path yourself.',
      communication: 'Direct, dense, no preamble. You dislike being talked around. In close relationships, slow down and show more of your reasoning, or people will feel the verdict is already in.',
      compatibleTypes: ['ENFP', 'ENTP'],
      challengingTypes: ['ESFP', 'ESFJ']
    },
    growth: {
      zh: {
        stage1: '早期：意识到独立思考是你的优势，开始用它解决具体问题，并接受自己与多数人节奏不同。',
        stage2: '中期：学会与情绪共处，发现"理性"之外的世界。让信任的人进入你的内圈，体验关系的复杂性。',
        stage3: '成熟期：能在战略与温度之间自由切换。你的远见开始能影响周围的人，不再只是孤独的判断。'
      },
      en: {
        stage1: 'Early: recognize independent thought as your superpower. Apply it to concrete problems. Make peace with marching to your own tempo.',
        stage2: 'Mid: learn to coexist with emotion. Discover what lives outside "rational." Let trusted people inside the inner ring and accept relational complexity.',
        stage3: 'Mature: move fluidly between strategy and warmth. Your foresight starts to lift those around you — no longer a lonely judgment.'
      }
    },
    famousPeople: [
      { nameZh: '钱学森', nameEn: 'Qian Xuesen', titleZh: '科学家', titleEn: 'Scientist' },
      { nameZh: '任正非', nameEn: 'Ren Zhengfei', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '鲁迅', nameEn: 'Lu Xun', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '张爱玲', nameEn: 'Eileen Chang', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '埃隆·马斯克', nameEn: 'Elon Musk', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '尼采', nameEn: 'Friedrich Nietzsche', titleZh: '哲学家', titleEn: 'Philosopher' },
      { nameZh: '克里斯托弗·诺兰', nameEn: 'Christopher Nolan', titleZh: '导演', titleEn: 'Film Director' },
      { nameZh: '斯蒂芬·霍金', nameEn: 'Stephen Hawking', titleZh: '物理学家', titleEn: 'Physicist' }
    ]
  },

  INTP: {
    code: 'INTP', nameZh: '思辨者', nameEn: 'Logician',
    group: 'NT', themeColor: '#6366F1',
    tagline: { zh: '永不满足的好奇心，在概念世界里漫游。', en: 'Endless curiosity, wandering through the world of concepts.' },
    zh: {
      profile: '思辨者是思维的探险家。你对世界的规律本身着迷，而不仅仅是它的应用。常常一个问题能让你想一整周，从一个角度想到另一个角度。你不太在意人际表面的礼节，但会被一个有趣的想法迅速点亮。',
      strengths: '强大的抽象思考力；能发现别人忽略的逻辑漏洞；面对复杂问题时反而越发兴奋；独立判断，不容易被群体意见左右；学习速度快，跨领域吸收能力强。',
      challenges: '有时把事情想得太复杂，迟迟不动手。容易在"完美思路"里反复打磨，错过执行窗口。对琐碎事务（行政、人情往来）耐受度低。情绪话题处理上需要刻意练习。',
      loveLanguage: '你在感情里需要的是一个能跟你"思想互动"的人。你的表达常常是分享一段有趣的想法，而不是直白的"我喜欢你"。请提醒自己：伴侣需要被看见的不只是大脑，还有情绪。',
      friendship: '更愿意和能聊深的人做朋友。你不会主动维护社交，但对真正聊得来的朋友愿意付出大段时间。朋友少不是问题，质量是你的标准。',
      career: '适合：研究员、软件架构师、数据科学家、哲学/数学/物理学者、产品策略、学术写作。不太适合：销售、客户服务、行政管理这类需要稳定情感劳动的岗位。',
      workStyle: '需要大段不被打扰的深度时间。喜欢一个人或在极小团队里工作。讨厌频繁会议和模板化流程。给你一个有挑战的问题比给你 KPI 更有效。',
      communication: '说话偏向精确，避免夸张。有时会因为"想说全"而显得啰嗦或抽象。多用比喻和故事能帮你的想法落地到对方那里。',
      compatibleTypes: ['ENTJ', 'ENFJ'],
      challengingTypes: ['ESFJ', 'ESTJ']
    },
    en: {
      profile: 'Logicians are explorers of thought. You are drawn to the underlying rules of the world, not only their applications. One question can spin in your head for a week, turned over from a dozen angles. You don\'t care much for social ceremony, but an interesting idea lights you up instantly.',
      strengths: 'Powerful abstract reasoning; you find logical holes others miss; complexity energizes rather than scares you; independent judgment that resists group pressure; fast cross-domain learner.',
      challenges: 'You sometimes over-think and delay execution. You can polish a "perfect plan" past the window of action. Low tolerance for admin and social niceties. Emotional conversations need deliberate practice.',
      loveLanguage: 'You need a partner who can engage with your mind. Your love language is often sharing a fascinating idea, not a direct "I love you." Remember — your partner needs more than your intellect; they need to feel your emotion too.',
      friendship: 'You prefer friends you can think with. Social maintenance does not come naturally, but for those who truly click with you, you will give large slabs of time. A small circle is fine — quality is your standard.',
      career: 'Fits: research, software architecture, data science, philosophy/math/physics, product strategy, academic writing. Less ideal: roles dominated by stable emotional labor — sales, customer service, line management.',
      workStyle: 'You need long uninterrupted deep-work blocks. You thrive alone or in tiny teams. Frequent meetings and template-driven processes drain you. A meaty problem beats a KPI every time.',
      communication: 'You aim for precision and avoid hyperbole. Sometimes the need to "say it fully" makes you sound abstract. Lean on metaphors and stories to land your ideas where the listener actually lives.',
      compatibleTypes: ['ENTJ', 'ENFJ'],
      challengingTypes: ['ESFJ', 'ESTJ']
    },
    growth: {
      zh: {
        stage1: '早期：接受自己的思考节奏，承认"想得慢但想得深"是优势，不必跟跑追快的人。',
        stage2: '中期：练习把想法落到行动上，哪怕粗糙也先做出来。学习处理情绪议题，不再回避。',
        stage3: '成熟期：能把抽象洞见翻译成可执行的方案，并带动他人理解。思想开始走出书房。'
      },
      en: {
        stage1: 'Early: accept your own thinking tempo. "Slow but deep" is an asset; you don\'t have to keep up with the sprinters.',
        stage2: 'Mid: practice landing thought into action — ship rough first. Stop avoiding emotional terrain.',
        stage3: 'Mature: translate abstract insight into executable plans that others can join. Your thinking leaves the study.'
      }
    },
    famousPeople: [
      { nameZh: '王小波', nameEn: 'Wang Xiaobo', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '老子', nameEn: 'Laozi', titleZh: '哲学家', titleEn: 'Philosopher' },
      { nameZh: '陈景润', nameEn: 'Chen Jingrun', titleZh: '数学家', titleEn: 'Mathematician' },
      { nameZh: '梁思成', nameEn: 'Liang Sicheng', titleZh: '建筑学家', titleEn: 'Architect' },
      { nameZh: '阿尔伯特·爱因斯坦', nameEn: 'Albert Einstein', titleZh: '物理学家', titleEn: 'Physicist' },
      { nameZh: '艾萨克·牛顿', nameEn: 'Isaac Newton', titleZh: '物理学家', titleEn: 'Physicist' },
      { nameZh: '查尔斯·达尔文', nameEn: 'Charles Darwin', titleZh: '生物学家', titleEn: 'Biologist' },
      { nameZh: '比尔·盖茨', nameEn: 'Bill Gates', titleZh: '企业家', titleEn: 'Entrepreneur' }
    ]
  },

  ENTJ: {
    code: 'ENTJ', nameZh: '指挥官', nameEn: 'Commander',
    group: 'NT', themeColor: '#4F46E5',
    tagline: { zh: '天生的组织者，把愿景变成现实。', en: 'Born organizer who turns vision into reality.' },
    zh: {
      profile: '指挥官天生有一种"把事情推动起来"的能量。你看到一个问题，就会立刻在脑子里架起一个解决框架，然后拉人、分工、定节奏。你不害怕做决定，也不害怕做错——错了就改。你对效率和结果有近乎本能的追求。',
      strengths: '强组织能力；天然的领导气场；面对压力时更专注而不是退缩；理性决策与战略眼光兼具；执行力极强，能把"想法"变成"机制"。',
      challenges: '有时步伐过快，容易让团队感到被推着走。对低效会不耐烦，可能显得苛刻。情绪话题处理上偏直接，需要给身边人留缓冲。',
      loveLanguage: '你在感情中希望成为对方的合伙人，而不只是恋人。你会主动规划共同未来，安排生活节奏。提醒自己：伴侣需要的不全是"被规划"，也需要被倾听、被放慢。',
      friendship: '你的朋友通常是能彼此激发的人——一起做事、一起思辨、一起进步。你不擅长无目的闲聊，但愿意为朋友的成长投入真金白银。',
      career: '适合：管理者、CEO、创业者、咨询合伙人、投行/律所合伙人、政治领导、产品总监。不太适合：纯执行无决策权的岗位、需要长期低自主度的角色。',
      workStyle: '目标导向、节奏快、敢于授权。喜欢从全局倒推细节。习惯把"模糊"立刻转成"清单"。下属如果跟得上节奏会成长很快。',
      communication: '简洁、有力、不爱铺垫。倾向于直接给结论，再补论据。需要学习在亲近关系里软化语气——同样的话讲温柔一点，效果会更好。',
      compatibleTypes: ['INTP', 'INFP'],
      challengingTypes: ['ISFP', 'INFP']
    },
    en: {
      profile: 'Commanders have an innate "let\'s get this moving" energy. See a problem and you immediately frame a solution, then recruit, divide, and set the cadence. You aren\'t afraid to decide, or to be wrong — wrong gets corrected. Efficiency and results are almost instinctive priorities.',
      strengths: 'Strong organizational instincts; natural leadership presence; pressure sharpens rather than scatters you; rational decision-making fused with strategic vision; rare execution power that turns ideas into mechanisms.',
      challenges: 'You can move so fast the team feels pushed. Inefficiency frustrates you and can make you seem harsh. Your way of handling emotional topics is direct — leave room for others to absorb it.',
      loveLanguage: 'You want a partner, not just a lover. You\'ll plan the shared future and set the household rhythm. Reminder: a partner doesn\'t only want to be organized — they want to be heard, and to slow you down.',
      friendship: 'Your friends tend to be peers who sharpen you — doing things, debating, growing together. Aimless chat isn\'t your gift, but you\'ll put real resources into friends\' growth.',
      career: 'Fits: managers, CEOs, founders, consulting partners, IB / law-firm partners, political leadership, product directors. Less ideal: pure execution roles with no decision authority, or long-term low-autonomy positions.',
      workStyle: 'Goal-driven, fast, comfortable delegating. You reverse-engineer from the big picture. Vague becomes a checklist instantly. People who keep up grow fast under you.',
      communication: 'Concise, forceful, no preamble. You hand over conclusions, then back-fill arguments. In close relationships, soften — same words, gentler tone, better effect.',
      compatibleTypes: ['INTP', 'INFP'],
      challengingTypes: ['ISFP', 'INFP']
    },
    growth: {
      zh: {
        stage1: '早期：发现自己天然的组织力，开始主动承担责任，接受"做决定就要承担后果"。',
        stage2: '中期：学习放慢节奏，关注团队中每个人的状态。意识到结果不是唯一价值。',
        stage3: '成熟期：能在推进与共情之间自如平衡。你的领导力开始让人愿意追随，而不是被推着走。'
      },
      en: {
        stage1: 'Early: discover your organizational power. Step into responsibility. Accept that deciding means owning consequences.',
        stage2: 'Mid: slow the cadence. Notice each teammate\'s state. Recognize that outcome isn\'t the only value.',
        stage3: 'Mature: balance drive with empathy. People follow you because they want to, not because they\'re carried by your momentum.'
      }
    },
    famousPeople: [
      { nameZh: '邓小平', nameEn: 'Deng Xiaoping', titleZh: '政治家', titleEn: 'Statesman' },
      { nameZh: '雷军', nameEn: 'Lei Jun', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '武则天', nameEn: 'Wu Zetian', titleZh: '历史人物', titleEn: 'Historical Figure' },
      { nameZh: '曾国藩', nameEn: 'Zeng Guofan', titleZh: '政治家', titleEn: 'Statesman' },
      { nameZh: '史蒂夫·乔布斯', nameEn: 'Steve Jobs', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '玛格丽特·撒切尔', nameEn: 'Margaret Thatcher', titleZh: '政治家', titleEn: 'Stateswoman' },
      { nameZh: '富兰克林·罗斯福', nameEn: 'Franklin D. Roosevelt', titleZh: '总统', titleEn: 'President' },
      { nameZh: '戈登·拉姆齐', nameEn: 'Gordon Ramsay', titleZh: '主厨', titleEn: 'Chef' }
    ]
  },

  ENTP: {
    code: 'ENTP', nameZh: '辩论家', nameEn: 'Debater',
    group: 'NT', themeColor: '#7C3AED',
    tagline: { zh: '思想的烟火制造者，永远在挑战常规。', en: 'A maker of intellectual fireworks, always challenging the obvious.' },
    zh: {
      profile: '辩论家是讨论桌上最不安分的那一个。你天然会反问、会唱反调，不是为了对立，是为了让一个想法被更全面地检验。你脑子里同时跑着好几个项目，朋友形容你"像随时会冒出新点子的机器"。',
      strengths: '快速联想能力强；面对未知反而兴奋；不害怕挑战权威；语言反应快、辩论功底好；能把多个看似无关的领域串成新机会。',
      challenges: '想法多但完成率不高。容易因为不断追逐新刺激而把旧项目搁置。在严肃场合可能因为玩笑显得不正式。会议里偶尔过度发挥导致团队跟不上。',
      loveLanguage: '在感情里你需要一个能跟你"互相挑战"的伴侣，不害怕思辨。你的浪漫是给对方一段有趣的对话，而不是花和巧克力。请记得：伴侣需要稳定感，不只是新鲜感。',
      friendship: '朋友是你的灵感源泉。你喜欢和聪明、不拘小节的人混在一起。你愿意为朋友的事拼一把，但需要朋友包容你"做事不到细节"这个特点。',
      career: '适合：创业者、产品经理、广告创意、市场策略、风投人、记者、咨询师。不太适合：高度规章化、流程稳定、需要日常重复细致的岗位。',
      workStyle: '靠"激发"工作，不靠"维持"。零到一阶段最出色。需要搭配一个能把事情做完的执行型搭档。',
      communication: '机敏、爱抛悬念、爱反问。容易把对话带到有趣的远方。在亲近关系里需要刻意收一点"杠"的能量，给别人讲完话的空间。',
      compatibleTypes: ['INFJ', 'INTJ'],
      challengingTypes: ['ISTJ', 'ISFJ']
    },
    en: {
      profile: 'Debaters are the restless ones at every discussion table. You instinctively flip the question and play devil\'s advocate — not for opposition, but to stress-test an idea from every side. Several projects run in parallel in your head; friends call you "a machine that keeps spitting out new ideas."',
      strengths: 'Fast lateral thinking; unknowns excite you; no fear of challenging authority; verbal agility and debate craft; you stitch unrelated domains into novel opportunities.',
      challenges: 'Plenty of ideas, lower completion rate. New shiny things pull you off older projects. Jokes in serious settings can come off as not-quite-professional. In meetings you sometimes spin so fast the team can\'t keep up.',
      loveLanguage: 'You want a partner who can spar with you and not flinch. Your romance is a fascinating conversation, not flowers. Remember — your partner needs stability too, not only novelty.',
      friendship: 'Friends are fuel. You gather around clever, low-formality people. You\'ll go to bat for friends, but they\'ll need to accept that you don\'t always close the loop on details.',
      career: 'Fits: founders, product managers, creative direction, marketing strategy, venture capital, journalism, consulting. Less ideal: heavily regulated, process-stable, daily-repetitive roles.',
      workStyle: 'You operate on ignition, not maintenance. Zero-to-one is your zone. Pair with an executor who can carry things across the finish line.',
      communication: 'Sharp, fond of suspense and counter-questions. You can take a conversation to unexpected places. In close relationships, throttle the "devil\'s advocate" energy — let others finish.',
      compatibleTypes: ['INFJ', 'INTJ'],
      challengingTypes: ['ISTJ', 'ISFJ']
    },
    growth: {
      zh: {
        stage1: '早期：接受自己"散点"的天性，开始用这种能量带动有趣的小项目，找到第一群志同道合的人。',
        stage2: '中期：学会聚焦，培养完成的肌肉。意识到"持续做完一件事"才是创新真正落地的方式。',
        stage3: '成熟期：把灵感、批判力和执行打通。你的想法不再只是闪光，而是能改变身边的局面。'
      },
      en: {
        stage1: 'Early: accept your scatter-shot nature. Channel that energy into small, interesting projects. Find your first crew of kindred minds.',
        stage2: 'Mid: train focus. Build the completion muscle. Realize that "finishing things over and over" is what makes innovation land.',
        stage3: 'Mature: fuse inspiration, critique, and execution. Your ideas stop being sparks and start changing the rooms you walk into.'
      }
    },
    famousPeople: [
      { nameZh: '苏轼', nameEn: 'Su Shi', titleZh: '文学家', titleEn: 'Poet' },
      { nameZh: '罗永浩', nameEn: 'Luo Yonghao', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '韩寒', nameEn: 'Han Han', titleZh: '作家·导演', titleEn: 'Writer · Director' },
      { nameZh: '李宇春', nameEn: 'Li Yuchun', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '马克·吐温', nameEn: 'Mark Twain', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '托马斯·爱迪生', nameEn: 'Thomas Edison', titleZh: '发明家', titleEn: 'Inventor' },
      { nameZh: '小罗伯特·唐尼', nameEn: 'Robert Downey Jr.', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '沃尔特·迪士尼', nameEn: 'Walt Disney', titleZh: '创作者', titleEn: 'Creator' }
    ]
  },

  /* ============================== NF 外交家族 ============================== */

  INFJ: {
    code: 'INFJ', nameZh: '提倡者', nameEn: 'Advocate',
    group: 'NF', themeColor: '#10B981',
    tagline: { zh: '安静的理想主义者，用洞察力关怀世界。', en: 'A quiet idealist whose insight serves the world.' },
    zh: {
      profile: '提倡者是稀有而矛盾的存在：你有 N 的远见，又有 F 的温度。你看得见别人没看见的暗流，也愿意为陌生人的痛苦多想一步。你内向，但你的内向不是回避，而是为了观察。你做事看似温和，内核却很坚定。',
      strengths: '深刻的洞察力，能"读懂"别人；有理想驱动力，做事有意义感；写作和表达能力强；对长远价值的判断比眼前利益更准；让人感到被真正看见。',
      challenges: '容易过度承担别人的情绪。理想化让你对现实失望。习惯隐藏自己的需求，时间久了会内耗。完美主义和"救世主"倾向需要克制。',
      loveLanguage: '你在感情中寻求深度连接——你想看到对方的灵魂。你愿意倾听、共情、给对方空间，但需要伴侣也能反过来看见你。最怕的是把自己掏空却没人接住。',
      friendship: '朋友少而精。你愿意花长时间陪一个真正重要的人，但不耐烦应酬。你常常是朋友的情绪树洞，记得也要找人接住你自己。',
      career: '适合：心理咨询、写作、教育、社工、产品研究、人文研究、公益、文创。不太适合：纯销售导向、需要不断与陌生人短平快互动的岗位。',
      workStyle: '需要安静、有意义感的环境。喜欢长期项目而不是 KPI 冲刺。做事追求"质感"，会在细节上反复推敲。',
      communication: '温和、有层次、注重对方的感受。讨厌肤浅讨论。在表达自己需求上经常太克制——直接说出来会更好。',
      compatibleTypes: ['ENFP', 'ENTP'],
      challengingTypes: ['ESTP', 'ESTJ']
    },
    en: {
      profile: 'Advocates are a rare and paradoxical pair: the foresight of N and the warmth of F. You sense undercurrents others miss and will go out of your way for a stranger\'s pain. Your introversion isn\'t avoidance — it\'s observation. You appear gentle, but the core is quietly unshakable.',
      strengths: 'Deep insight that "reads" people; ideals that drive meaning into your work; gifted writer and speaker; long-arc judgment trumps short-term temptations; you make others feel actually seen.',
      challenges: 'You absorb others\' emotions too easily. Idealism sets you up for reality\'s disappointments. You hide your own needs until you burn out. The perfectionist-savior reflex needs reins.',
      loveLanguage: 'You crave depth — you want to meet your partner\'s soul. You listen, empathize, give room — but you need a partner who in turn sees you. The worst-case scenario is pouring yourself out with no one catching you.',
      friendship: 'Few friends, deep friends. You\'ll spend hours with one person who matters, but social rituals tire you. You\'re often the emotional refuge — remember to find your own refuge too.',
      career: 'Fits: counseling, writing, education, social work, product research, humanities, nonprofit, cultural creation. Less ideal: high-volume sales or roles built on rapid, shallow interactions with strangers.',
      workStyle: 'You need quiet, meaning, and time. Long-term projects beat KPI sprints. You polish for "texture" — sometimes reworking details others wouldn\'t notice.',
      communication: 'Gentle, layered, attuned to the listener. You dislike surface chatter. You under-state your own needs — say them out loud more often.',
      compatibleTypes: ['ENFP', 'ENTP'],
      challengingTypes: ['ESTP', 'ESTJ']
    },
    growth: {
      zh: {
        stage1: '早期：意识到自己的敏感是天赋而非弱点，开始用文字、艺术或服务他人把它转化出去。',
        stage2: '中期：学会设立边界——你不必接住每个人的情绪。开始主动表达自己的需求。',
        stage3: '成熟期：把理想转化为可落地的工作或事业。你的洞察开始系统地影响一群人。'
      },
      en: {
        stage1: 'Early: see your sensitivity as a gift, not a flaw. Channel it through writing, art, or service to others.',
        stage2: 'Mid: learn boundaries — you don\'t have to catch every emotion in the room. Start naming your own needs out loud.',
        stage3: 'Mature: translate ideals into work that lands. Your insight begins to shape a community, not just individuals.'
      }
    },
    famousPeople: [
      { nameZh: '林徽因', nameEn: 'Lin Huiyin', titleZh: '建筑师·作家', titleEn: 'Architect · Writer' },
      { nameZh: '三毛', nameEn: 'San Mao', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '玄奘', nameEn: 'Xuanzang', titleZh: '高僧', titleEn: 'Buddhist Monk' },
      { nameZh: '海子', nameEn: 'Hai Zi', titleZh: '诗人', titleEn: 'Poet' },
      { nameZh: '柏拉图', nameEn: 'Plato', titleZh: '哲学家', titleEn: 'Philosopher' },
      { nameZh: '卡尔·荣格', nameEn: 'Carl Jung', titleZh: '心理学家', titleEn: 'Psychologist' },
      { nameZh: '马丁·路德·金', nameEn: 'Martin Luther King Jr.', titleZh: '社会活动家', titleEn: 'Civil Rights Leader' },
      { nameZh: 'J·K·罗琳', nameEn: 'J. K. Rowling', titleZh: '作家', titleEn: 'Author' }
    ]
  },

  INFP: {
    code: 'INFP', nameZh: '调停者', nameEn: 'Mediator',
    group: 'NF', themeColor: '#14B8A6',
    tagline: { zh: '温柔的理想主义者，相信美好值得被守护。', en: 'A gentle idealist who believes beauty is worth protecting.' },
    zh: {
      profile: '调停者的世界由价值观构筑。你不在意是否"显得专业"，但你非常在意一件事是否"配得上你"。你内心住着一个诗人和一个守护者——会为一首歌掉眼泪，也会为不公正的事按下不能后退的按钮。',
      strengths: '丰富的情感深度；强烈的价值观与道德感；写作、艺术、共情能力强；对人性有罕见的耐心；能在他人的故事里看见美。',
      challenges: '容易在理想与现实的差距中挣扎。被批评时反应强烈，会怀疑自我。拖延和"完美才行动"是常见挑战。容易吸收别人的负面情绪。',
      loveLanguage: '你在感情中追寻灵魂层面的契合，比起浪漫，你更想被理解。你会安静地为对方做很多小事，但希望对方能看见。请提醒自己：理想化伴侣会让真实的人辛苦。',
      friendship: '朋友是你心灵的避风港。你不擅长大群体社交，但对真正的朋友会全心投入。你的温度让人愿意把脆弱交给你。',
      career: '适合：写作、设计、心理咨询、人文研究、公益、教师、文创、影视。不太适合：高强度商业谈判、纯数字驱动、需要冷漠决断的岗位。',
      workStyle: '需要有意义感才能持续。被催 KPI 时容易心理消耗。最好的状态是一个相信的目标加一段自主的时间。',
      communication: '温柔、含蓄、回避冲突。习惯把情绪藏在文字里。在重要事情上需要更直接地表达自己想要什么——你的"还好"经常不是"还好"。',
      compatibleTypes: ['ENFJ', 'ENTJ'],
      challengingTypes: ['ESTJ', 'ESTP']
    },
    en: {
      profile: 'A Mediator\'s world is built on values. You don\'t care if you appear "professional"; you care intensely whether something is "worthy of you." A poet and a guardian live in you — you\'ll cry at a song, and you\'ll dig in immovably against an injustice.',
      strengths: 'Emotional depth; strong values and moral compass; gifts in writing, art, and empathy; rare patience with human complexity; you can see beauty inside other people\'s stories.',
      challenges: 'The gap between ideal and reality is hard on you. Criticism cuts deep and triggers self-doubt. Procrastination and "wait till it\'s perfect" are common. You absorb others\' negativity easily.',
      loveLanguage: 'You seek soul-level fit. More than romance, you want to be understood. You quietly do many small things for your partner and hope they notice. Remember: idealizing your partner makes the real person\'s life harder.',
      friendship: 'Friends are your shelter. Large-group social is not your thing, but to a true friend you give everything. Your warmth invites others to hand you their vulnerability.',
      career: 'Fits: writing, design, counseling, humanities research, nonprofit, teaching, cultural creation, film/TV. Less ideal: high-intensity commercial negotiation, purely numbers-driven roles requiring cold decisions.',
      workStyle: 'You need meaning to sustain energy. KPI pressure drains you. Best mode: a goal you believe in plus uninterrupted autonomy.',
      communication: 'Gentle, indirect, conflict-averse. You hide emotion in your writing. On important things, say what you actually want out loud — your "I\'m fine" often isn\'t.',
      compatibleTypes: ['ENFJ', 'ENTJ'],
      challengingTypes: ['ESTJ', 'ESTP']
    },
    growth: {
      zh: {
        stage1: '早期：接受自己的敏感，开始用文字、艺术等方式表达内在世界，不再因为"不实用"而否定它。',
        stage2: '中期：学会处理冲突，敢于说不，建立现实层面的边界感与执行力。',
        stage3: '成熟期：把理想和现实嫁接起来。你的温柔成为一种力量，影响真实可见的人。'
      },
      en: {
        stage1: 'Early: accept your sensitivity. Begin expressing your inner world through writing, art, or craft — stop dismissing it as "impractical."',
        stage2: 'Mid: learn to hold conflict. Practice saying no. Build real-world boundaries and execution muscles.',
        stage3: 'Mature: graft ideal onto reality. Your gentleness becomes a force that shapes lives you can actually see.'
      }
    },
    famousPeople: [
      { nameZh: '顾城', nameEn: 'Gu Cheng', titleZh: '诗人', titleEn: 'Poet' },
      { nameZh: '张国荣', nameEn: 'Leslie Cheung', titleZh: '演员·歌手', titleEn: 'Actor · Singer' },
      { nameZh: '庄子', nameEn: 'Zhuangzi', titleZh: '哲学家', titleEn: 'Philosopher' },
      { nameZh: '宫崎骏', nameEn: 'Hayao Miyazaki', titleZh: '动画导演', titleEn: 'Animation Director' },
      { nameZh: '文森特·梵高', nameEn: 'Vincent van Gogh', titleZh: '画家', titleEn: 'Painter' },
      { nameZh: '奥黛丽·赫本', nameEn: 'Audrey Hepburn', titleZh: '演员·人道主义者', titleEn: 'Actress · Humanitarian' },
      { nameZh: 'J·R·R·托尔金', nameEn: 'J. R. R. Tolkien', titleZh: '作家', titleEn: 'Author' },
      { nameZh: '威廉·莎士比亚', nameEn: 'William Shakespeare', titleZh: '剧作家', titleEn: 'Playwright' }
    ]
  },

  ENFJ: {
    code: 'ENFJ', nameZh: '主人公', nameEn: 'Protagonist',
    group: 'NF', themeColor: '#06B6D4',
    tagline: { zh: '天生的引路人，让身边的人变得更好。', en: 'A natural guide who lifts everyone around you.' },
    zh: {
      profile: '主人公天生具有"激励他人"的能量。你走进一个房间，气氛会被你抬起来一档。你真心在乎别人是否在变好，并愿意为此投入精力。你既有 N 的远见，也有 F 的温度，加上 J 的执行力。',
      strengths: '强烈的同理心与号召力；能把团队聚到一个共同方向；擅长引导、教学、说服；对长期愿景有清晰判断；让人觉得"我在你身边变得更好"。',
      challenges: '把别人的事情当成自己的事情，容易超载。难以拒绝求助。过度在意别人的看法。对自己要求高，可能忽视自身需求。',
      loveLanguage: '你在感情中希望成为伴侣的成长伙伴。你会主动倾听、规划、付出，但需要伴侣也回报真诚。最大的痛苦是发现"我一直在投入，对方却没有变"。',
      friendship: '朋友众多，关系层次清晰。你能记住朋友的细节，朋友也愿意把心事给你。注意区分"被需要"和"被真正喜欢"。',
      career: '适合：教育、HR、咨询、医疗、公益、市场、组织发展、品牌、政治。不太适合：长期独立无社交的研究岗位、纯数据导向无人际互动的工作。',
      workStyle: '团队驱动型。在协作中最出色。喜欢看到每个人成长。会主动承担组织角色，但要警惕"过度负责"导致自己被掏空。',
      communication: '温暖、有感染力、表达清晰。说服力强，但要注意不要让自己的热情压过对方的节奏。',
      compatibleTypes: ['INFP', 'ISFP'],
      challengingTypes: ['ISTP', 'INTP']
    },
    en: {
      profile: 'Protagonists carry a natural "lift the room" energy. Walk into a meeting and the temperature warms one degree. You genuinely care that others are getting better, and you\'ll spend yourself to make it happen. You combine N\'s foresight, F\'s warmth, and J\'s execution.',
      strengths: 'Powerful empathy and gathering power; you align teams around a shared direction; gifted at coaching, teaching, persuasion; clear long-vision judgment; people feel "I become better near you."',
      challenges: 'You take others\' problems as your own and overload. Saying no is hard. You weigh others\' opinions too much. High standards for yourself can mean ignoring your own needs.',
      loveLanguage: 'In love you want to be a growth partner. You listen, plan, give — but you need it returned honestly. Your deepest pain is realizing you\'ve been pouring while the other person hasn\'t moved.',
      friendship: 'Many friends, clear concentric circles. You remember details and people trust you with their inner stories. Distinguish "being needed" from "being genuinely loved."',
      career: 'Fits: education, HR, consulting, healthcare, nonprofit, marketing, org development, brand, political work. Less ideal: long isolated research without social work, purely data-only roles.',
      workStyle: 'You shine in collaboration. You love seeing everyone grow. You\'ll volunteer for organizing roles — watch the "over-responsible" trap that empties you out.',
      communication: 'Warm, contagious, clear. Strong persuader — just don\'t let your enthusiasm steamroll someone else\'s pace.',
      compatibleTypes: ['INFP', 'ISFP'],
      challengingTypes: ['ISTP', 'INTP']
    },
    growth: {
      zh: {
        stage1: '早期：意识到自己的影响力，开始有意识地引导身边的人，承担小范围的组织角色。',
        stage2: '中期：学会照顾自己的情绪，不把"被人需要"当作自我价值的唯一来源。',
        stage3: '成熟期：能在影响他人和忠于自己之间平衡。你的引导带着真实的力量，而不是疲惫的牺牲。'
      },
      en: {
        stage1: 'Early: notice your influence. Step into small organizing roles. Choose to lift the people around you.',
        stage2: 'Mid: tend to your own emotions. Stop letting "being needed" be your only source of self-worth.',
        stage3: 'Mature: balance influencing others with staying true to yourself. Your guidance carries real strength, not exhausted sacrifice.'
      }
    },
    famousPeople: [
      { nameZh: '孔子', nameEn: 'Confucius', titleZh: '思想家', titleEn: 'Philosopher' },
      { nameZh: '周恩来', nameEn: 'Zhou Enlai', titleZh: '政治家', titleEn: 'Statesman' },
      { nameZh: '杨澜', nameEn: 'Yang Lan', titleZh: '传媒人', titleEn: 'Media Host' },
      { nameZh: '撒贝宁', nameEn: 'Sa Beining', titleZh: '主持人', titleEn: 'TV Host' },
      { nameZh: '巴拉克·奥巴马', nameEn: 'Barack Obama', titleZh: '总统', titleEn: 'President' },
      { nameZh: '奥普拉·温弗瑞', nameEn: 'Oprah Winfrey', titleZh: '主持人', titleEn: 'TV Host' },
      { nameZh: '约翰·列侬', nameEn: 'John Lennon', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '玛雅·安杰罗', nameEn: 'Maya Angelou', titleZh: '诗人', titleEn: 'Poet' }
    ]
  },

  ENFP: {
    code: 'ENFP', nameZh: '活动家', nameEn: 'Campaigner',
    group: 'NF', themeColor: '#0EA5E9',
    tagline: { zh: '热情的可能性探险家，把每一天过成新故事。', en: 'A passionate possibility-hunter turning each day into a new story.' },
    zh: {
      profile: '活动家是行走的灵感雷达。你能从一次咖啡馆偶遇里看出一段故事，能从一个新朋友身上发现下一个项目。你的热情真实可感，让别人忍不住想加入你的世界。你看似随性，内心却有一套清晰的价值观底盘。',
      strengths: '高度灵感驱动；很强的人际连接力；能让别人感到被点亮；多领域兴趣；面对新机会反应快、愿意尝试。',
      challenges: '想法多但容易半途而废。情绪起伏大，状态影响产出。容易承担过多，最后疲惫。需要别人提醒回到优先级。',
      loveLanguage: '你需要一个理解你"内心宇宙"的伴侣。你的浪漫是分享一段奇妙的体验、一个新想法。请记得：伴侣需要稳定的承诺，不只是新鲜感。',
      friendship: '朋友圈像花园：广而多样。你能让朋友之间互相认识，常常成为"中间人"。但要避免把自己摊薄到每个人。',
      career: '适合：创意、市场、内容创作、产品、咨询、心理、传媒、培训、文化创业。不太适合：高度重复、数据为主、长期单调的岗位。',
      workStyle: '灵感型工作者。喜欢与不同人协作。在零到一阶段非常出色。需要一个可靠的搭档帮你把事情收尾。',
      communication: '热情、跳跃、生动。容易让人觉得被看见。要注意不要太快把话题切走，给别人讲完的空间。',
      compatibleTypes: ['INTJ', 'INFJ'],
      challengingTypes: ['ISTJ', 'ESTJ']
    },
    en: {
      profile: 'Campaigners are walking inspiration radars. A coffee-shop encounter becomes a story; a new acquaintance becomes a project. Your enthusiasm is genuinely felt and pulls people into your world. You look free-spirited, but a clear value system anchors you underneath.',
      strengths: 'High inspiration drive; magnetic social connection; you light people up; broad-interest range; fast and willing response to new opportunities.',
      challenges: 'Many starts, fewer finishes. Mood swings affect output. You take on too much and burn out. You need others to remind you of priorities.',
      loveLanguage: 'You need a partner who gets your inner universe. Your romance is a shared, surprising experience or a new idea. Remember: your partner needs stable commitment, not only novelty.',
      friendship: 'Your friend network is a garden — wide and varied. You connect friends to each other, often the "matchmaker." Avoid spreading yourself so thin no one gets a real piece of you.',
      career: 'Fits: creative work, marketing, content, product, consulting, psychology, media, training, cultural entrepreneurship. Less ideal: highly repetitive, data-heavy, long-monotony roles.',
      workStyle: 'Inspiration-driven. You love collaborating with diverse people. Zero-to-one is your strength. Pair with a reliable closer.',
      communication: 'Warm, leaping, vivid. People feel seen. Slow down — give others room to finish before you change the topic.',
      compatibleTypes: ['INTJ', 'INFJ'],
      challengingTypes: ['ISTJ', 'ESTJ']
    },
    growth: {
      zh: {
        stage1: '早期：接受自己"散点"的能量，先用兴趣驱动尝试不同方向，积累真实体验。',
        stage2: '中期：学会聚焦一两件事做到底，建立完成的肌肉。情绪管理也要开始练习。',
        stage3: '成熟期：能把多年积累的"广度"转化为深度，做出独属于你的事业。'
      },
      en: {
        stage1: 'Early: accept your scatter-energy. Let interest drive exploration. Stack up real, varied experience.',
        stage2: 'Mid: pick one or two things and finish them — build the completion muscle. Begin emotional regulation practice.',
        stage3: 'Mature: convert years of breadth into depth, building a body of work that only you could have made.'
      }
    },
    famousPeople: [
      { nameZh: '蔡康永', nameEn: 'Kevin Tsai', titleZh: '主持人·作家', titleEn: 'TV Host · Writer' },
      { nameZh: '高晓松', nameEn: 'Gao Xiaosong', titleZh: '音乐人·主持', titleEn: 'Musician · Host' },
      { nameZh: '谢娜', nameEn: 'Xie Na', titleZh: '主持人', titleEn: 'TV Host' },
      { nameZh: '余华', nameEn: 'Yu Hua', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '罗宾·威廉姆斯', nameEn: 'Robin Williams', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '威尔·史密斯', nameEn: 'Will Smith', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '艾伦·德杰尼勒斯', nameEn: 'Ellen DeGeneres', titleZh: '主持人', titleEn: 'TV Host' },
      { nameZh: '昆汀·塔伦蒂诺', nameEn: 'Quentin Tarantino', titleZh: '导演', titleEn: 'Film Director' }
    ]
  },

  /* ============================== SJ 守护者族 ============================== */

  ISTJ: {
    code: 'ISTJ', nameZh: '物流师', nameEn: 'Logistician',
    group: 'SJ', themeColor: '#2563EB',
    tagline: { zh: '可靠的执行者，把承诺当作底线。', en: 'A dependable executor who treats a promise as bedrock.' },
    zh: {
      profile: '物流师是组织里最不起眼也最不可缺的人。你不喜欢华丽的表达，但你说出的话基本会做到。你看重事实、规则和秩序，把每一件事做到位是你内心的安全感来源。在你周围的人会感到"踏实"。',
      strengths: '极强的责任感与执行力；细心、严谨、有秩序感；能在压力下保持节奏；事实导向、不被情绪带偏；长期积累出深厚的专业能力。',
      challenges: '对变化的适应需要时间。有时太重规则，少了一些灵活。情感表达不够主动，亲近的人偶尔会感觉距离。容易把"应该"压在自己身上。',
      loveLanguage: '你在感情里是行动派——准时接送、记得纪念日、规划生活。你不擅长说情话，但你会通过把生活打理得井井有条来表达爱。请记得偶尔也用言语告诉对方。',
      friendship: '朋友是慢慢攒下的，但一旦认下就长长久久。你不会主动维护浅交，但对真朋友有求必应。',
      career: '适合：财务、法务、审计、运营、行政、工程师、医生、军警、项目经理。不太适合：高度不确定的创意岗位、需要随性发挥的销售型工作。',
      workStyle: '流程驱动、可复制、可追溯。你喜欢把混乱整理成 SOP，让团队不再返工。给你清晰目标，你会用最稳的方式完成。',
      communication: '直接、就事论事、避免夸张。在亲近关系里需要主动多分享一点自己的感受。',
      compatibleTypes: ['ESFP', 'ESTP'],
      challengingTypes: ['ENFP', 'ENTP']
    },
    en: {
      profile: 'Logisticians are the quietly indispensable backbone of any organization. You don\'t go in for flowery language, but if you said it, you\'ll do it. You value facts, rules, and order, and your sense of safety comes from doing each thing properly. People around you feel "grounded."',
      strengths: 'Powerful responsibility and follow-through; precise, rigorous, ordered; rhythm holds under pressure; fact-driven, hard to derail emotionally; deep professional craft compounded over years.',
      challenges: 'Adapting to change takes time. Sometimes rules win over flexibility. You don\'t volunteer emotion, and even close people can feel some distance. You stack too many "shoulds" on yourself.',
      loveLanguage: 'You\'re a doer in love — on-time pickups, remembered anniversaries, planned logistics. Sweet talk doesn\'t come easy; you express care by keeping life orderly. Try saying it out loud sometimes too.',
      friendship: 'Friends are accumulated slowly, kept long. You won\'t maintain shallow contacts but you\'ll show up for the real ones.',
      career: 'Fits: finance, legal, audit, ops, admin, engineering, medicine, police/military, project management. Less ideal: highly uncertain creative roles, free-form sales.',
      workStyle: 'Process-driven, repeatable, traceable. You turn chaos into SOPs and stop the rework loop. Hand you a clear goal and you\'ll deliver the most reliable version.',
      communication: 'Direct, to the point, no theatrics. In close relationships, share a bit more of how you feel.',
      compatibleTypes: ['ESFP', 'ESTP'],
      challengingTypes: ['ENFP', 'ENTP']
    },
    growth: {
      zh: {
        stage1: '早期：在小事上建立可靠的口碑，积累专业能力，找到能让你深耕的领域。',
        stage2: '中期：练习面对变化与模糊，学会在规则之外做判断。开始更主动表达自己的情感。',
        stage3: '成熟期：成为团队和家庭里真正的"主心骨"。你的稳重开始有温度，不只是规矩。'
      },
      en: {
        stage1: 'Early: build reliability one small task at a time. Stack professional craft. Find a field deep enough to grow into.',
        stage2: 'Mid: practice with change and ambiguity. Learn to judge beyond the rules. Start volunteering your feelings.',
        stage3: 'Mature: become the real backbone of your team and family. Your steadiness now carries warmth, not just order.'
      }
    },
    famousPeople: [
      { nameZh: '朱镕基', nameEn: 'Zhu Rongji', titleZh: '政治家', titleEn: 'Statesman' },
      { nameZh: '钱穆', nameEn: 'Qian Mu', titleZh: '历史学家', titleEn: 'Historian' },
      { nameZh: '雍正皇帝', nameEn: 'Emperor Yongzheng', titleZh: '历史人物', titleEn: 'Historical Figure' },
      { nameZh: '杨绛', nameEn: 'Yang Jiang', titleZh: '作家·翻译家', titleEn: 'Writer · Translator' },
      { nameZh: '乔治·华盛顿', nameEn: 'George Washington', titleZh: '总统', titleEn: 'President' },
      { nameZh: '沃伦·巴菲特', nameEn: 'Warren Buffett', titleZh: '投资人', titleEn: 'Investor' },
      { nameZh: '安格拉·默克尔', nameEn: 'Angela Merkel', titleZh: '政治家', titleEn: 'Stateswoman' },
      { nameZh: '娜塔莉·波特曼', nameEn: 'Natalie Portman', titleZh: '演员', titleEn: 'Actress' }
    ]
  },

  ISFJ: {
    code: 'ISFJ', nameZh: '守卫者', nameEn: 'Defender',
    group: 'SJ', themeColor: '#1D4ED8',
    tagline: { zh: '温柔而坚韧的守护者，用细心照亮日常。', en: 'A gentle yet tenacious protector who tends the everyday.' },
    zh: {
      profile: '守卫者是那种"你不说我也知道你需要什么"的人。你善于注意到别人忽略的细节，并默默把它处理好。你低调，但你的付出累积起来，是身边人难以离开的安全感。',
      strengths: '细致体贴；对承诺极度认真；记忆力好，能记住别人喜欢什么不喜欢什么；危机时刻最冷静；让人感到被照料。',
      challenges: '太容易把别人的事放在自己之前。难以拒绝。被忽视的付出会在心里累积成委屈。变化和冲突让你不安。',
      loveLanguage: '你的爱通过日常的照顾流出来——一杯温度刚好的水、一件提前洗好的衣服。你不擅长直白表达，但希望对方能看见这份细心。请记得告诉对方你的需求，否则你会逐渐变成"看不见的人"。',
      friendship: '朋友少而深，且持续多年。你是大家的精神支柱，但要记得自己也需要被照顾。',
      career: '适合：医护、教师、社工、HR、行政、客服、护理、设计、文秘、家庭咨询。不太适合：高竞争对抗性的销售、需要冷酷决断的高层博弈岗位。',
      workStyle: '细心、稳定、可托付。喜欢清晰的角色和稳定的环境。不喜欢突如其来的变动。给你信任，你会还以多倍的努力。',
      communication: '温和、克制、回避冲突。需要练习"说出自己想要什么"，而不是默默承担。',
      compatibleTypes: ['ESTP', 'ESFP'],
      challengingTypes: ['ENTP', 'ESTP']
    },
    en: {
      profile: 'Defenders are the kind of person who "knows what you need before you ask." You notice the details others miss and quietly take care of them. You\'re low-key, but the steady accumulation of your care becomes a safety those around you can\'t imagine without.',
      strengths: 'Attentive and thoughtful; serious about commitments; great memory for what people like and dislike; calmest in a crisis; people feel cared for around you.',
      challenges: 'You put others ahead of yourself too easily. Saying no is hard. Unseen care builds quiet resentment. Sudden change and conflict unsettle you.',
      loveLanguage: 'Love flows through daily care — a glass of water at just the right temperature, laundry folded before it was asked for. You don\'t verbalize easily; you hope your partner notices. Voice your needs too, or you slowly become invisible.',
      friendship: 'Few friends, deep friends, long years. You are everyone\'s emotional anchor — remember you need anchoring too.',
      career: 'Fits: healthcare, teaching, social work, HR, admin, customer service, nursing, design, secretarial work, family counseling. Less ideal: aggressive sales arenas, cold-decision executive battlegrounds.',
      workStyle: 'Careful, stable, trustworthy. You like clear roles and steady environments. Abrupt change unsettles you. Trust you, and you\'ll repay it many times over.',
      communication: 'Gentle, restrained, conflict-averse. Practice naming what you want, instead of silently absorbing.',
      compatibleTypes: ['ESTP', 'ESFP'],
      challengingTypes: ['ENTP', 'ESTP']
    },
    growth: {
      zh: {
        stage1: '早期：意识到自己的细心是天赋，开始有意识地把照顾别人变成一种"专业能力"。',
        stage2: '中期：学会拒绝，建立边界。开始把"自己想要什么"放在重要位置。',
        stage3: '成熟期：能在照顾他人和照顾自己之间平衡。你的稳定开始成为整个圈子的底座。'
      },
      en: {
        stage1: 'Early: recognize your attentiveness as a gift. Begin treating care for others as a professional skill, not just a habit.',
        stage2: 'Mid: learn to say no. Build boundaries. Move "what I want" to a central place.',
        stage3: 'Mature: balance caring for others with caring for yourself. Your steadiness becomes the foundation of an entire circle.'
      }
    },
    famousPeople: [
      { nameZh: '邓丽君', nameEn: 'Teresa Teng', titleZh: '歌手', titleEn: 'Singer' },
      { nameZh: '林青霞', nameEn: 'Brigitte Lin', titleZh: '演员', titleEn: 'Actress' },
      { nameZh: '老舍', nameEn: 'Lao She', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '冰心', nameEn: 'Bing Xin', titleZh: '作家', titleEn: 'Writer' },
      { nameZh: '特蕾莎修女', nameEn: 'Mother Teresa', titleZh: '人道主义者', titleEn: 'Humanitarian' },
      { nameZh: '伊丽莎白二世', nameEn: 'Queen Elizabeth II', titleZh: '君主', titleEn: 'Monarch' },
      { nameZh: '凯特·米德尔顿', nameEn: 'Kate Middleton', titleZh: '王妃', titleEn: 'Princess of Wales' },
      { nameZh: '罗莎·帕克斯', nameEn: 'Rosa Parks', titleZh: '社会活动家', titleEn: 'Civil Rights Activist' }
    ]
  },

  ESTJ: {
    code: 'ESTJ', nameZh: '总经理', nameEn: 'Executive',
    group: 'SJ', themeColor: '#0369A1',
    tagline: { zh: '务实的组织者，让事情有秩序地发生。', en: 'A practical organizer who makes things happen in order.' },
    zh: {
      profile: '总经理是天然的"管事的"。你看到混乱就想梳理，看到拖延就想推动。你尊重规则、看重责任、相信"该说就说、该做就做"。在你的世界里，含糊不清是最大的浪费。',
      strengths: '执行力极强；判断果断；组织和管理能力天然；有规则意识；能在压力下保持稳定输出；让团队"知道方向"。',
      challenges: '有时步子太快，让团队跟不上。对效率以外的价值（情绪、过程感）耐受度低。容易显得"管得太严"。',
      loveLanguage: '在感情中你是负责的那一方。你会主动规划、承担责任、解决问题。提醒自己：伴侣需要的不只是被解决，还需要被理解。',
      friendship: '朋友圈实用而稳定。你会主动组织聚会、安排活动。朋友会觉得"有你在事情就不会乱"。',
      career: '适合：管理岗、运营总监、项目经理、销售总监、军政、法律、财务、行政、教练。不太适合：纯探索性、长期模糊的创意岗位。',
      workStyle: '目标—节点—问责，三件套一气呵成。喜欢明确的角色与分工。给你授权和资源，你会把事情按时按质交付。',
      communication: '直接、有力、不绕弯。在家庭和亲近关系里需要主动放软，让人感受到关心而不是被指挥。',
      compatibleTypes: ['ISFP', 'INFP'],
      challengingTypes: ['INFP', 'INTP']
    },
    en: {
      profile: 'Executives are natural "the person in charge." Chaos triggers your need to organize; procrastination triggers your need to push. You respect rules, take responsibility seriously, and believe in "say what needs saying, do what needs doing." In your world, ambiguity is the greatest waste.',
      strengths: 'Powerful execution; decisive judgment; natural organizing and management talent; rule-aware; steady output under pressure; teams know where they\'re going.',
      challenges: 'Sometimes your pace outruns the team. Low tolerance for non-efficiency values like emotion and process feel. Can come across as "too controlling."',
      loveLanguage: 'You\'re the responsible one in love. You plan, you carry the weight, you solve. Reminder: your partner needs to be understood too, not only solved.',
      friendship: 'A practical, stable circle. You organize the gatherings and trips. Friends say "things don\'t fall apart when you\'re around."',
      career: 'Fits: management, ops directors, project management, sales directors, military/government, law, finance, admin, coaching. Less ideal: exploratory, long-ambiguous creative roles.',
      workStyle: 'Goal → milestone → accountability, all in one move. You like clear roles and ownership. Authorize and resource you, and the work ships on time and on quality.',
      communication: 'Direct, forceful, no detours. At home and in close ties, soften deliberately — make people feel cared for, not commanded.',
      compatibleTypes: ['ISFP', 'INFP'],
      challengingTypes: ['INFP', 'INTP']
    },
    growth: {
      zh: {
        stage1: '早期：抓住任何能锻炼组织力的机会，开始建立"靠谱"的口碑。',
        stage2: '中期：学会倾听不同节奏的人，明白效率不是唯一价值。',
        stage3: '成熟期：在权威和共情之间游刃有余。你的领导力开始让人主动跟随。'
      },
      en: {
        stage1: 'Early: grab every chance to flex organizational muscle. Build your "reliable" reputation.',
        stage2: 'Mid: learn to hear people on different tempos. Internalize that efficiency isn\'t the only value.',
        stage3: 'Mature: navigate fluidly between authority and empathy. People follow because they want to.'
      }
    },
    famousPeople: [
      { nameZh: '朱元璋', nameEn: 'Zhu Yuanzhang', titleZh: '皇帝', titleEn: 'Emperor' },
      { nameZh: '张居正', nameEn: 'Zhang Juzheng', titleZh: '政治家', titleEn: 'Statesman' },
      { nameZh: '董明珠', nameEn: 'Dong Mingzhu', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '王健林', nameEn: 'Wang Jianlin', titleZh: '企业家', titleEn: 'Entrepreneur' },
      { nameZh: '希拉里·克林顿', nameEn: 'Hillary Clinton', titleZh: '政治家', titleEn: 'Politician' },
      { nameZh: '亨利·福特', nameEn: 'Henry Ford', titleZh: '实业家', titleEn: 'Industrialist' },
      { nameZh: '索尼娅·索托马约尔', nameEn: 'Sonia Sotomayor', titleZh: '大法官', titleEn: 'Supreme Court Justice' },
      { nameZh: '朱迪法官', nameEn: 'Judge Judy', titleZh: '主持人·法官', titleEn: 'TV Judge' }
    ]
  },

  ESFJ: {
    code: 'ESFJ', nameZh: '执政官', nameEn: 'Consul',
    group: 'SJ', themeColor: '#0284C7',
    tagline: { zh: '热心的连接者，让群体真正"在一起"。', en: 'A warm connector who turns a group into a real community.' },
    zh: {
      profile: '执政官是社群里温柔的"主心骨"。你记得每个人的生日、每个家人的口味、谁最近不开心。你天生愿意为大家创造归属感，而且会把这件事做得很细。你在乎和谐，也愿意为和谐付出。',
      strengths: '强人际连接力；有秩序感和责任感；细心、可靠、热心；能让大群体顺畅运转；让别人感到被照顾、被包容。',
      challenges: '在意他人评价，会因为别人的反应而内耗。难以拒绝。冲突让你不舒服，可能选择回避而非面对。容易过度付出后感觉委屈。',
      loveLanguage: '你的爱体现在日常的细心：饭菜、节日、问候。你希望对方也以同样的温度回应你。请记得：被需要不等于被爱，敢于表达自己的真实情绪。',
      friendship: '朋友众多，关系绵密。你是聚会的中心，能让陌生人之间也变得自在。但要注意区分"维护关系"和"消耗自己"。',
      career: '适合：教师、护士、客服、HR、活动策划、品牌公关、餐饮服务、培训、家庭咨询。不太适合：长期独立无社交、高度对抗性的辩论岗位。',
      workStyle: '协作型、人际型、流程型。喜欢稳定的环境和明确的预期。在团队氛围好的地方表现最好。',
      communication: '热情、礼貌、注重对方感受。要练习直接表达不同意见，而不是迂回。',
      compatibleTypes: ['ISTP', 'ISFP'],
      challengingTypes: ['INTP', 'INTJ']
    },
    en: {
      profile: 'Consuls are the gentle backbone of any community. You remember the birthdays, the dietary preferences, who\'s been low lately. You instinctively manufacture belonging, and you do it with real care. Harmony matters to you, and you\'ll spend yourself to keep it.',
      strengths: 'Strong relational glue; sense of order and responsibility; attentive, reliable, warm; you make large groups run smoothly; people feel held and welcomed around you.',
      challenges: 'You over-weight other people\'s opinions and internalize. Saying no is hard. Conflict makes you anxious; you may avoid rather than face. Over-giving leaves quiet resentment.',
      loveLanguage: 'Love shows in the daily warmth — meals, holidays, check-ins. You hope your partner matches your temperature. Remember: being needed isn\'t the same as being loved. Speak your honest feelings.',
      friendship: 'Many friends, dense networks. You\'re the hub of the gathering, the person who makes strangers comfortable. Distinguish "maintaining the relationship" from "draining yourself."',
      career: 'Fits: teaching, nursing, customer service, HR, event planning, brand and PR, hospitality, training, family counseling. Less ideal: long isolated roles, highly combative debate positions.',
      workStyle: 'Collaborative, relational, process-aware. You like stable environments and clear expectations. Best performance in psychologically safe teams.',
      communication: 'Warm, polite, listener-aware. Practice voicing disagreement directly, not in loops.',
      compatibleTypes: ['ISTP', 'ISFP'],
      challengingTypes: ['INTP', 'INTJ']
    },
    growth: {
      zh: {
        stage1: '早期：把自然的人际能力变成专业能力，开始在团队里扮演组织角色。',
        stage2: '中期：学会面对冲突，建立边界。开始把"我自己怎么想"放进决策。',
        stage3: '成熟期：你的温度成为别人的稳定剂，而你自己也活得真实。'
      },
      en: {
        stage1: 'Early: turn natural people skills into professional skill. Step into organizing roles within a team.',
        stage2: 'Mid: face conflict head-on. Build boundaries. Put "what I think" into your decisions.',
        stage3: 'Mature: your warmth stabilizes others while you live authentically.'
      }
    },
    famousPeople: [
      { nameZh: '林志玲', nameEn: 'Lin Chi-ling', titleZh: '演员·模特', titleEn: 'Actress · Model' },
      { nameZh: '何炅', nameEn: 'He Jiong', titleZh: '主持人', titleEn: 'TV Host' },
      { nameZh: '杨幂', nameEn: 'Yang Mi', titleZh: '演员', titleEn: 'Actress' },
      { nameZh: '沈腾', nameEn: 'Shen Teng', titleZh: '喜剧演员', titleEn: 'Comedian · Actor' },
      { nameZh: '比尔·克林顿', nameEn: 'Bill Clinton', titleZh: '总统', titleEn: 'President' },
      { nameZh: '泰勒·斯威夫特', nameEn: 'Taylor Swift', titleZh: '歌手', titleEn: 'Singer' },
      { nameZh: '休·杰克曼', nameEn: 'Hugh Jackman', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '詹妮弗·加纳', nameEn: 'Jennifer Garner', titleZh: '演员', titleEn: 'Actress' }
    ]
  },

  /* ============================== SP 探险家族 ============================== */

  ISTP: {
    code: 'ISTP', nameZh: '鉴赏家', nameEn: 'Virtuoso',
    group: 'SP', themeColor: '#F59E0B',
    tagline: { zh: '安静的实干家，用双手理解世界。', en: 'A quiet doer who understands the world through their hands.' },
    zh: {
      profile: '鉴赏家用"做"来学习。你不喜欢空谈，喜欢拆开一样东西看看它怎么运作。你冷静、独立、好奇，对工具和系统有天然亲近感。你的话不多，但每一句都不浪费。',
      strengths: '动手能力强；临场反应快；冷静处理危机；独立自给自足；能在混乱中找到关键变量；学习新工具速度极快。',
      challenges: '对长期承诺有点抗拒，习惯保留撤退选项。情感表达不够主动，亲近的人有时不确定你的感受。容易因为无聊而离场。',
      loveLanguage: '你不是会写情书的那一种，但你会用行动表达——帮对方修东西、安排出行、解决具体问题。请记得：伴侣也希望偶尔听到你的内心话。',
      friendship: '朋友少而真。你不维护关系靠言语，但关键时刻你会出现。和你做朋友需要接受你"消失一阵又出现"的节奏。',
      career: '适合：工程师、技术专家、维修、运动员、急救、安全、产品工艺、影像后期、机械设计。不太适合：高密度社交、需要持续情绪能量的客户岗位。',
      workStyle: '自主、问题导向、即时反馈。喜欢一个人或在小团队里实操。不喜欢长会和模板报告。给你工具和问题，你会找到方案。',
      communication: '简洁、低情绪、就事论事。需要练习"主动表达"，否则别人会以为你不在意。',
      compatibleTypes: ['ESFJ', 'ENFJ'],
      challengingTypes: ['ENFJ', 'ESFJ']
    },
    en: {
      profile: 'Virtuosos learn by doing. Theory bores you; you want to take the thing apart and see how it works. Calm, independent, curious, you have a natural feel for tools and systems. You don\'t say much, but nothing you say is wasted.',
      strengths: 'High hands-on capability; sharp under pressure; calm in crisis; self-sufficient; you find the critical variable inside chaos; you pick up new tools fast.',
      challenges: 'Resistance to long-term commitment — you keep exit options open. Slow to volunteer feeling; close people sometimes aren\'t sure where you stand. Boredom can make you disappear.',
      loveLanguage: 'You\'re not the love-letter type, but you act on it — fixing things, planning trips, solving concrete problems. Remember: your partner also wants to hear what\'s in your head sometimes.',
      friendship: 'Few friends, real ones. You don\'t maintain through words, but you show up when it counts. Friendship with you means accepting your "disappear and reappear" rhythm.',
      career: 'Fits: engineering, technical specialty, repair, athletics, emergency response, safety, manufacturing craft, post-production, mechanical design. Less ideal: high-volume social roles, sustained emotional-labor customer positions.',
      workStyle: 'Autonomous, problem-driven, real-time feedback. You like working alone or in tiny teams, hands-on. You dislike long meetings and template reports. Give you a tool and a problem.',
      communication: 'Brief, low-emotion, to the point. Practice volunteering thought — silence reads as indifference to others.',
      compatibleTypes: ['ESFJ', 'ENFJ'],
      challengingTypes: ['ENFJ', 'ESFJ']
    },
    growth: {
      zh: {
        stage1: '早期：找到一项可以"动手玩"的技能，让它给你带来真实的成就感。',
        stage2: '中期：学会承诺，建立长期关系和长期项目。开始更主动表达内心。',
        stage3: '成熟期：把动手能力发展为深度专业，并能带动一个小团队稳步前行。'
      },
      en: {
        stage1: 'Early: find one craft you can "play hands-on" with. Let it give you real, earned wins.',
        stage2: 'Mid: practice commitment — to relationships, to long projects. Start volunteering what\'s inside.',
        stage3: 'Mature: scale your hands-on craft into deep expertise that can carry a small team forward.'
      }
    },
    famousPeople: [
      { nameZh: '李连杰', nameEn: 'Jet Li', titleZh: '武术家·演员', titleEn: 'Martial Artist · Actor' },
      { nameZh: '周杰伦', nameEn: 'Jay Chou', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '王家卫', nameEn: 'Wong Kar-wai', titleZh: '导演', titleEn: 'Film Director' },
      { nameZh: '吴清源', nameEn: 'Go Seigen', titleZh: '围棋大师', titleEn: 'Go Master' },
      { nameZh: '克林特·伊斯特伍德', nameEn: 'Clint Eastwood', titleZh: '导演·演员', titleEn: 'Director · Actor' },
      { nameZh: '迈克尔·乔丹', nameEn: 'Michael Jordan', titleZh: '运动员', titleEn: 'Athlete' },
      { nameZh: '汤姆·克鲁斯', nameEn: 'Tom Cruise', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '贝爷·格里尔斯', nameEn: 'Bear Grylls', titleZh: '探险家', titleEn: 'Adventurer' }
    ]
  },

  ISFP: {
    code: 'ISFP', nameZh: '艺术家', nameEn: 'Adventurer',
    group: 'SP', themeColor: '#EC4899',
    tagline: { zh: '温柔的感受者，把美藏在日常里。', en: 'A gentle sensor who hides beauty in everyday things.' },
    zh: {
      profile: '艺术家是用感官生活的人。你对色彩、声音、质感、空气湿度有别人没有的敏感。你不爱说大道理，但你的选择本身就是一种表达。你温柔但有底线，不会为了取悦谁丢掉自己的审美。',
      strengths: '强审美感知力；具体务实，不夸大；情感真诚，不演；对当下的体验有罕见的专注；能在小事里发现别人看不到的美。',
      challenges: '不擅长长远规划，容易"过一天算一天"。冲突让你想撤退。在表达深层情感上偏含蓄。容易被现实压力打消创作欲。',
      loveLanguage: '你的爱很安静——给对方做一顿饭、布置一个小角落、记得一个细节。你需要伴侣能读懂这些"不说出来的语言"。',
      friendship: '朋友不多，但都是能彼此感受到温度的人。你不擅长应酬，但对真朋友会全心。',
      career: '适合：设计师、摄影师、音乐人、手作匠人、空间设计、料理、芳疗、教育艺术。不太适合：高密度数字管理、长期对抗性的商业谈判。',
      workStyle: '需要自由度和审美空间。喜欢把作品做到自己满意。不擅长被催进度，但作品质感往往超出预期。',
      communication: '柔和、含蓄、注重对方的舒适度。需要练习直接表达不满和需求。',
      compatibleTypes: ['ENFJ', 'ESFJ'],
      challengingTypes: ['ENTJ', 'ESTJ']
    },
    en: {
      profile: 'Adventurers live through their senses. You notice color, sound, texture, even the humidity in the air, in ways others miss. You don\'t lecture; your choices are themselves a statement. Gentle but unbending — you won\'t betray your aesthetic to please anyone.',
      strengths: 'Powerful aesthetic perception; concrete and grounded; emotionally honest; rare focus on the present moment; you find beauty in small things others walk past.',
      challenges: 'Long-range planning isn\'t your strength — "one day at a time" can become a default. Conflict makes you retreat. You\'re indirect about deep feelings. Practical pressure can dim your creative drive.',
      loveLanguage: 'Your love is quiet — a meal cooked, a corner arranged, a small detail remembered. You need a partner who can read these "unspoken languages."',
      friendship: 'Few friends, all of them warm. Small talk doesn\'t come easily; for the real ones you give yourself fully.',
      career: 'Fits: design, photography, music, craft, spatial design, culinary, aromatherapy, arts education. Less ideal: dense numerical management, prolonged combative negotiation.',
      workStyle: 'You need freedom and aesthetic room. You finish when it\'s right by your eye. You don\'t respond well to push — but the texture of your output often exceeds expectations.',
      communication: 'Soft, indirect, listener-comfort first. Practice naming your dissatisfaction and your needs out loud.',
      compatibleTypes: ['ENFJ', 'ESFJ'],
      challengingTypes: ['ENTJ', 'ESTJ']
    },
    growth: {
      zh: {
        stage1: '早期：保护自己的审美，把它发展成真实的技艺，不要因为"不实用"就放弃。',
        stage2: '中期：学会面对现实和钱，把作品变成可持续的事业。开始更直接表达自己。',
        stage3: '成熟期：你的审美开始影响一群人，温柔本身成为一种力量。'
      },
      en: {
        stage1: 'Early: protect your aesthetic. Turn it into a real craft. Don\'t abandon it because it "isn\'t practical."',
        stage2: 'Mid: face money and reality. Turn the work into a sustainable practice. Begin to speak directly.',
        stage3: 'Mature: your aesthetic starts shaping a community. Gentleness itself becomes a force.'
      }
    },
    famousPeople: [
      { nameZh: '王菲', nameEn: 'Faye Wong', titleZh: '歌手', titleEn: 'Singer' },
      { nameZh: '朴树', nameEn: 'Pu Shu', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '陈奕迅', nameEn: 'Eason Chan', titleZh: '歌手', titleEn: 'Singer' },
      { nameZh: '林俊杰', nameEn: 'JJ Lin', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '迈克尔·杰克逊', nameEn: 'Michael Jackson', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '弗里达·卡罗', nameEn: 'Frida Kahlo', titleZh: '画家', titleEn: 'Painter' },
      { nameZh: '鲍勃·迪伦', nameEn: 'Bob Dylan', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '大卫·鲍伊', nameEn: 'David Bowie', titleZh: '音乐人', titleEn: 'Musician' }
    ]
  },

  ESTP: {
    code: 'ESTP', nameZh: '企业家', nameEn: 'Entrepreneur',
    group: 'SP', themeColor: '#EF4444',
    tagline: { zh: '行动派的现实玩家，敢闯敢拼敢享受。', en: 'A real-time player who dares, hustles, and enjoys.' },
    zh: {
      profile: '企业家是天生的行动派。你不喜欢长篇大论，喜欢上手就干。你敢冒险，能在压力下保持冷静——甚至越紧张越兴奋。你对机会敏锐，对节奏感强，是那种"风来了你已经在山顶"的人。',
      strengths: '极强的现实反应力；不害怕冒险；社交灵活、能与不同人迅速建立关系；危机处理能力强；能在变化里发现机会。',
      challenges: '对长期规划耐心有限。情绪表达偏短促，可能让亲近的人觉得不够细。会因为追求刺激而冒不必要的险。',
      loveLanguage: '你在感情里直接、慷慨、愿意为对方花精力。你的浪漫是一场出乎意料的旅行、一份精心挑选的礼物。请记得：稳定的小事和大场面同样重要。',
      friendship: '朋友圈活跃、多元、有趣。你能让朋友放松下来。但要避免把人际当成"流量"，留时间陪那些真正在乎你的人。',
      career: '适合：销售、市场、创业者、活动策划、谈判、急救、体育、影视、消防警察。不太适合：长期独坐研究、流程化无变化的岗位。',
      workStyle: '靠肾上腺素工作。喜欢现场、客户、突发事件。给你一个有挑战的目标，你会用最少的会议、最直接的方式把它推动起来。',
      communication: '直接、有力、爱开玩笑。在亲近关系里需要慢一点，让对方感到被听见而不是被推。',
      compatibleTypes: ['ISFJ', 'ISTJ'],
      challengingTypes: ['INFJ', 'INFP']
    },
    en: {
      profile: 'Entrepreneurs are born for real-time action. Long lectures bore you; you want to start. You take risks and stay cool under pressure — often the tighter the moment, the sharper you get. You read opportunity quickly and ride momentum, the kind of person already at the summit when the wind picks up.',
      strengths: 'Razor-sharp real-world response; risk-tolerant; socially flexible across very different people; crisis handler; you find opportunity inside change.',
      challenges: 'Limited patience for long-term planning. Emotion comes out in short bursts, which close people may read as thin. Chasing thrills can lead to unnecessary risk.',
      loveLanguage: 'Direct, generous, willing to spend yourself on your partner. Your romance is the surprise trip, the carefully chosen gift. Remember — small steady things matter as much as the grand scenes.',
      friendship: 'A lively, varied, fun circle. You relax people. Don\'t treat connections as traffic — make time for those who actually care.',
      career: 'Fits: sales, marketing, founders, event production, negotiation, emergency response, athletics, film/TV, fire/police. Less ideal: long-solo research, fully process-static roles.',
      workStyle: 'Adrenaline-fueled. You love on-site work, customers, surprises. Give you a challenging goal — you\'ll push it with minimum meetings and maximum directness.',
      communication: 'Direct, forceful, fond of humor. In close relationships, slow down — let people feel heard instead of nudged.',
      compatibleTypes: ['ISFJ', 'ISTJ'],
      challengingTypes: ['INFJ', 'INFP']
    },
    growth: {
      zh: {
        stage1: '早期：在风险可控范围里大胆尝试，把"敢"的优势用起来。',
        stage2: '中期：学会沉淀，把短期收益变成长期积累。提升情感细腻度。',
        stage3: '成熟期：成为有节奏感的领导者——既敢冲也知道何时停下来想清楚。'
      },
      en: {
        stage1: 'Early: take controlled risks. Use your "dare" advantage.',
        stage2: 'Mid: learn to compound. Convert short wins into long-term capital. Build emotional nuance.',
        stage3: 'Mature: become a leader with rhythm — bold enough to charge, wise enough to pause and think.'
      }
    },
    famousPeople: [
      { nameZh: '黄渤', nameEn: 'Huang Bo', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '黄晓明', nameEn: 'Huang Xiaoming', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '古天乐', nameEn: 'Louis Koo', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '韩寒', nameEn: 'Han Han', titleZh: '赛车手·导演', titleEn: 'Racer · Director' },
      { nameZh: '麦当娜', nameEn: 'Madonna', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '布鲁斯·威利斯', nameEn: 'Bruce Willis', titleZh: '演员', titleEn: 'Actor' },
      { nameZh: '艾迪·墨菲', nameEn: 'Eddie Murphy', titleZh: '喜剧演员', titleEn: 'Comedian' },
      { nameZh: '欧内斯特·海明威', nameEn: 'Ernest Hemingway', titleZh: '作家', titleEn: 'Writer' }
    ]
  },

  ESFP: {
    code: 'ESFP', nameZh: '表演者', nameEn: 'Entertainer',
    group: 'SP', themeColor: '#F97316',
    tagline: { zh: '现场的能量源，让生活变成一场派对。', en: 'A live-current of energy turning life into a party.' },
    zh: {
      profile: '表演者是生活的导演。你能把一顿普通晚饭变成一场记忆。你喜欢热闹、喜欢人、喜欢真实的体验。你不擅长抽象推理，但你对气氛、节奏和人心有罕见的直觉。',
      strengths: '高度的情绪感染力；现场反应力强；让陌生人很快融入；对美好生活有真诚的追求；危机时的乐观能感染整个团队。',
      challenges: '长期规划不是你的强项。被批评时反应较大。容易因为追求当下而忽视长期后果。情绪起伏会影响判断。',
      loveLanguage: '你在感情中浪漫、慷慨、愿意为对方付出。你的爱是一份惊喜、一个夜晚的舞蹈、一段共同的旅程。请记得：稳定的承诺和惊喜同样重要。',
      friendship: '朋友众多，氛围温暖。你是聚会的灵魂。但要留出独处时间消化情绪，避免被人群淹没。',
      career: '适合：演艺、主持、销售、活动、餐饮、培训、儿童教育、运动教练、设计。不太适合：纯数据、长期独立、规则严苛无人际互动的岗位。',
      workStyle: '人际驱动、现场驱动、灵感驱动。在客户、舞台、教室这种"活的"场景下最闪光。',
      communication: '热情、生动、富有感染力。要注意在严肃场合保持节奏，给重要议题留出空间。',
      compatibleTypes: ['ISTJ', 'ISFJ'],
      challengingTypes: ['INTJ', 'INTP']
    },
    en: {
      profile: 'Entertainers direct life itself. You can turn an ordinary dinner into a memory. You love crowds, people, and real experience. Abstract reasoning isn\'t your home, but you have rare intuition for vibe, rhythm, and what people are feeling.',
      strengths: 'Powerful emotional contagion; live-event reflex; you welcome strangers in fast; sincere pursuit of good living; in crisis your optimism can lift the whole team.',
      challenges: 'Long-range planning isn\'t your strength. Criticism stings. Chasing the present can shortchange long-term consequences. Mood swings move your judgment.',
      loveLanguage: 'In love you\'re romantic, generous, willing to spend on your partner. Love looks like a surprise, a dance, a shared trip. Remember: steady commitment matters as much as fireworks.',
      friendship: 'Many friends, warm vibe. You\'re the party\'s soul. Take some solo time to process emotions — don\'t let the crowd swallow you.',
      career: 'Fits: performance, hosting, sales, events, hospitality, training, children\'s education, sports coaching, design. Less ideal: pure data, prolonged solitude, strict rule-bound roles with no human interaction.',
      workStyle: 'People-, stage-, inspiration-driven. You shine in "alive" settings: customers, classrooms, performances.',
      communication: 'Warm, vivid, contagious. In serious contexts, hold tempo — leave space for the heavy topics to land.',
      compatibleTypes: ['ISTJ', 'ISFJ'],
      challengingTypes: ['INTJ', 'INTP']
    },
    growth: {
      zh: {
        stage1: '早期：拥抱自己天生的舞台感，把它变成可持续的技能而不是消耗。',
        stage2: '中期：学会长期规划和延迟满足。开始照顾自己情绪的高低起伏。',
        stage3: '成熟期：把现场感染力沉淀为深度专业，成为别人愿意长久追随的"温暖能量源"。'
      },
      en: {
        stage1: 'Early: embrace your natural stage feel. Turn it into a sustainable craft, not just an output.',
        stage2: 'Mid: learn long-range planning and delayed reward. Begin tending your own emotional waves.',
        stage3: 'Mature: deepen your stage presence into real expertise — become the warm, durable energy people stay near.'
      }
    },
    famousPeople: [
      { nameZh: 'Angelababy', nameEn: 'Angelababy', titleZh: '演员', titleEn: 'Actress' },
      { nameZh: '邓紫棋', nameEn: 'G.E.M.', titleZh: '歌手', titleEn: 'Singer' },
      { nameZh: '鹿晗', nameEn: 'Luhan', titleZh: '歌手·演员', titleEn: 'Singer · Actor' },
      { nameZh: '贾玲', nameEn: 'Jia Ling', titleZh: '喜剧演员', titleEn: 'Comedian' },
      { nameZh: '玛丽莲·梦露', nameEn: 'Marilyn Monroe', titleZh: '演员', titleEn: 'Actress' },
      { nameZh: '猫王', nameEn: 'Elvis Presley', titleZh: '音乐人', titleEn: 'Musician' },
      { nameZh: '阿黛尔', nameEn: 'Adele', titleZh: '歌手', titleEn: 'Singer' },
      { nameZh: '贾斯汀·比伯', nameEn: 'Justin Bieber', titleZh: '歌手', titleEn: 'Singer' }
    ]
  },

};

// 自检：在控制台打印类型数量
if (typeof console !== 'undefined') {
  console.log('[personality-types.js] total types =', Object.keys(window.PERSONALITY_TYPES).length);
}
