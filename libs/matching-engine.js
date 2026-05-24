/*!
 * libs/matching-engine.js — 三盘合一关系匹配引擎
 * --------------------------------------------------------------
 * 命名空间：window.MATCHING_ENGINE
 *
 * 总分（0-100）= MBTI(30) + 八字(35) + 星座(25) + 阴阳(10)
 *
 * 5 个关系类型（影响打分语义）：
 *   'love'      恋爱（相生最佳，相克最忌）
 *   'marriage'  夫妻（同 love）
 *   'friend'    朋友（同频更佳）
 *   'partner'   事业合伙（相克反而互相制衡 → 高分）
 *   'colleague' 同事
 *
 * 输出还包含：
 *   - signals[]    : 5 项红绿灯（PUA / 花心 / 妈宝 / 拜金 / 情绪暴力）
 *   - signalsLevel : 'green' | 'yellow' | 'orange' | 'red'
 *   - popularAdvice: 5-8 条流行梗式相处建议
 *
 * 依赖：
 *   - window.BAZI（必须）
 *   - window.ASTRO（必须）
 *   - window.POPULAR_ADVICE（可选，未加载时建议为空数组）
 *
 * 设计原则：
 *   1. 描述文案由 matching-data.js 提供，引擎只回 score + categorical label
 *   2. 红绿灯采用"任一子条件满足即触发"（per spec），但每条信号都带免责声明
 *   3. 用户填的双方 MBTI 通常是 16 型（无 T/A 后缀），引擎按 16 型匹配
 */
(function () {
  'use strict';

  window.MATCHING_ENGINE = window.MATCHING_ENGINE || {};

  /* ========================================================================
   * 1. 常量与查表
   * ====================================================================== */

  // 五行生克
  const ELEMENT_GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
  const ELEMENT_CONTROLS  = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

  // MBTI "黄金搭档" — 互补功能配对（Ni-Ne / Si-Se / Fi-Fe / Ti-Te）
  const GOLDEN_PAIRS = [
    ['INTJ', 'ENFP'], ['INTJ', 'ENTP'],
    ['INFJ', 'ENFP'], ['INFJ', 'ENTP'],
    ['ISTJ', 'ESTP'], ['ISTJ', 'ESFP'],
    ['ISFJ', 'ESTP'], ['ISFJ', 'ESFP'],
    ['INFP', 'ENFJ'], ['INFP', 'ESFJ'],
    ['ISFP', 'ENFJ'], ['ISFP', 'ESFJ'],
    ['INTP', 'ENTJ'], ['INTP', 'ESTJ'],
    ['ISTP', 'ENTJ'], ['ISTP', 'ESTJ']
  ];

  /* ========================================================================
   * 2. 工具函数
   * ====================================================================== */

  function letterDiff(a, b) {
    let count = 0;
    for (let i = 0; i < 4; i++) if (a[i] !== b[i]) count++;
    return count;
  }

  function isGoldenPair(a, b) {
    for (const [x, y] of GOLDEN_PAIRS) {
      if ((a === x && b === y) || (a === y && b === x)) return true;
    }
    return false;
  }

  function mbtiFamily(t) {
    if (!t || t.length !== 4) return null;
    const mid = t.slice(1, 3);
    if (mid === 'NT') return 'NT';
    if (mid === 'NF') return 'NF';
    if (mid[0] === 'S' && t[3] === 'J') return 'SJ';
    if (mid[0] === 'S' && t[3] === 'P') return 'SP';
    return null;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  /* ========================================================================
   * 3. 子算法 1：MBTI 兼容（30 分）
   * ====================================================================== */

  function calcMBTICompat(typeA, typeB) {
    if (!typeA || !typeB) return null;

    const diff = letterDiff(typeA, typeB);
    let score, type;

    if (diff === 0) {
      score = 25; type = '同频型';
    } else if (diff === 1) {
      score = 22; type = '同频型';
    } else if (diff === 2) {
      score = 18; type = '挑战型';
    } else if (diff === 3) {
      score = 13; type = '冲突型';
    } else {
      // diff === 4: 完全相反
      score = 24; type = '互补型';
    }

    // 加分项
    if (isGoldenPair(typeA, typeB)) {
      score += 5;
      type = '互补型'; // 互补功能必定升级为互补型
    }
    if (mbtiFamily(typeA) === mbtiFamily(typeB) && mbtiFamily(typeA) !== null) {
      score += 3;
    }

    // 减分项
    if (diff === 0) {
      score -= 3; // 同质化
    }
    if (typeA[2] === 'T' && typeB[2] === 'T' && typeA[3] === 'J' && typeB[3] === 'J') {
      score -= 2; // 双 TJ：两个"控制狂"
    }
    if (typeA[2] === 'F' && typeB[2] === 'F' && typeA[3] === 'P' && typeB[3] === 'P') {
      score -= 2; // 双 FP：两个"漂浮人"
    }

    return {
      score: clamp(score, 0, 30),
      type,
      typeA,
      typeB,
      diff,
      isGoldenPair: isGoldenPair(typeA, typeB),
      sameFamily: mbtiFamily(typeA) === mbtiFamily(typeB)
    };
  }

  /* ========================================================================
   * 4. 子算法 2：八字兼容（35 分）
   * ====================================================================== */

  /**
   * 计算两人日主五行关系。
   * 返回：'same' | 'A_gen_B' | 'B_gen_A' | 'A_ke_B' | 'B_ke_A'
   */
  function fiveElementRelation(elA, elB) {
    if (elA === elB) return 'same';
    if (ELEMENT_GENERATES[elA] === elB) return 'A_gen_B';
    if (ELEMENT_GENERATES[elB] === elA) return 'B_gen_A';
    if (ELEMENT_CONTROLS[elA] === elB)  return 'A_ke_B';
    if (ELEMENT_CONTROLS[elB] === elA)  return 'B_ke_A';
    return 'unknown';
  }

  // 不同关系类型下的五行关系评分
  const BAZI_SCORE_TABLE = {
    love:      { same: 25, A_gen_B: 30, B_gen_A: 30, A_ke_B: 15, B_ke_A: 15 },
    marriage:  { same: 25, A_gen_B: 30, B_gen_A: 30, A_ke_B: 15, B_ke_A: 15 },
    friend:    { same: 28, A_gen_B: 26, B_gen_A: 26, A_ke_B: 20, B_ke_A: 20 },
    partner:   { same: 28, A_gen_B: 24, B_gen_A: 24, A_ke_B: 30, B_ke_A: 30 },
    colleague: { same: 28, A_gen_B: 26, B_gen_A: 26, A_ke_B: 25, B_ke_A: 25 }
  };

  function calcBaziCompat(baziA, baziB, relationType) {
    if (!baziA || !baziB) return null;

    const elA = baziA.dayMaster.element;
    const elB = baziB.dayMaster.element;
    const relation = fiveElementRelation(elA, elB);

    const relType = relationType || 'love';
    const table = BAZI_SCORE_TABLE[relType] || BAZI_SCORE_TABLE.love;
    let score = table[relation] != null ? table[relation] : 20;

    // 五行分布加减分
    const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
    let complementaryCount = 0;
    let sharedDeficiencyCount = 0;
    let bothExcessCount = 0;

    for (const e of elements) {
      const a = baziA.fiveElements[e] || 0;
      const b = baziB.fiveElements[e] || 0;
      // 互补：一方缺（0）一方多（≥2）
      if ((a === 0 && b >= 2) || (b === 0 && a >= 2)) complementaryCount++;
      // 同质缺：双方都为 0
      if (a === 0 && b === 0) sharedDeficiencyCount++;
      // 双方都极旺：≥3
      if (a >= 3 && b >= 3) bothExcessCount++;
    }

    if (complementaryCount > 0) score += 3;
    if (sharedDeficiencyCount > 0) score -= 2;
    if (bothExcessCount > 0) score -= 3;

    return {
      score: clamp(score, 0, 35),
      relation,
      relationType: relType,
      elementA: elA,
      elementB: elB,
      complementaryCount,
      sharedDeficiencyCount,
      bothExcessCount
    };
  }

  /* ========================================================================
   * 5. 子算法 3：星座兼容（25 分）
   * ====================================================================== */

  /**
   * 计算两个星座间的相位（最短弧距，以"星座格"为单位 0-6）。
   *   0 = 同  | 2 = 60° 六合  | 3 = 90° 刑  | 4 = 120° 三合  | 6 = 180° 冲
   */
  function signAngle(idxA, idxB) {
    const d = Math.abs(idxA - idxB);
    return Math.min(d, 12 - d);
  }

  function calcAstrologyCompat(astroA, astroB) {
    if (!astroA || !astroB) return null;

    const sunA = astroA.sun, sunB = astroB.sun;
    if (!sunA || !sunB) return null;

    /* ---- 太阳兼容（基础 7-14 + 相位 -3~+3） ---- */
    let sunScore = 0;
    const ea = sunA.element, eb = sunB.element;
    if (ea === eb) {
      sunScore = 13; // 同象同频
    } else if ((ea === 'air' && eb === 'fire') || (ea === 'fire' && eb === 'air')
            || (ea === 'earth' && eb === 'water') || (ea === 'water' && eb === 'earth')) {
      sunScore = 14; // 风+火（互相点燃）或 土+水（互相滋养）
    } else if ((ea === 'fire' && eb === 'earth') || (ea === 'earth' && eb === 'fire')
            || (ea === 'air' && eb === 'water') || (ea === 'water' && eb === 'air')) {
      sunScore = 10; // 火+土（互相磨损）或 风+水（互相阻断）
    } else if ((ea === 'fire' && eb === 'water') || (ea === 'water' && eb === 'fire')
            || (ea === 'air' && eb === 'earth') || (ea === 'earth' && eb === 'air')) {
      sunScore = 7; // 真冲突组合
    }

    // 太阳相位
    const sunAng = signAngle(sunA.index, sunB.index);
    let sunAngleBonus = 0;
    if (sunAng === 4) sunAngleBonus = 3;        // 三合
    else if (sunAng === 2) sunAngleBonus = 2;   // 六合
    else if (sunAng === 3) sunAngleBonus = -2;  // 刑
    else if (sunAng === 6) sunAngleBonus = -3;  // 冲

    sunScore = clamp(sunScore + sunAngleBonus, 0, 17);

    /* ---- 月亮加分（最多 +5） ---- */
    let moonScore = 0;
    if (astroA.moon && astroB.moon) {
      if (astroA.moon.element === astroB.moon.element) moonScore += 3;
      const moonAng = signAngle(astroA.moon.index, astroB.moon.index);
      if (moonAng === 4) moonScore += 5;
      else if (moonAng === 6) moonScore -= 3;
    }
    moonScore = clamp(moonScore, -3, 5);

    /* ---- 上升加分（最多 +5） ---- */
    let risingScore = 0;
    if (astroA.rising && astroB.rising) {
      if (astroA.rising.element === astroB.rising.element) risingScore += 2;
      // 交叉灵魂伴侣：A 太阳 = B 上升 或 B 太阳 = A 上升
      if (astroA.sun.index === astroB.rising.index || astroB.sun.index === astroA.rising.index) {
        risingScore += 5;
      }
    }
    risingScore = clamp(risingScore, 0, 7);

    const total = clamp(sunScore + moonScore + risingScore, 0, 25);

    return {
      score: total,
      sunScore,
      sunAngle: sunAng,
      moonScore,
      risingScore,
      sunRelation: ea === eb ? 'same_element' :
                   ((ea === 'air' && eb === 'fire') || (ea === 'fire' && eb === 'air')
                 || (ea === 'earth' && eb === 'water') || (ea === 'water' && eb === 'earth'))
                   ? 'helpful' : 'tension'
    };
  }

  /* ========================================================================
   * 6. 子算法 4：阴阳调和（10 分）
   * ====================================================================== */

  function calcYinYang(personA, personB) {
    function yangScore(p) {
      let s = 0;
      if (p.gender === 'male') s++;
      if (p.mbti && p.mbti[0] === 'E') s++;
      if (p.bazi && p.bazi.dayMaster && p.bazi.dayMaster.yinYang === 'yang') s++;
      if (p.astro && p.astro.sun && (p.astro.sun.element === 'fire' || p.astro.sun.element === 'air')) s++;
      return s;
    }
    function yinScore(p) {
      let s = 0;
      if (p.gender === 'female') s++;
      if (p.mbti && p.mbti[0] === 'I') s++;
      if (p.bazi && p.bazi.dayMaster && p.bazi.dayMaster.yinYang === 'yin') s++;
      if (p.astro && p.astro.sun && (p.astro.sun.element === 'water' || p.astro.sun.element === 'earth')) s++;
      return s;
    }

    const yangA = yangScore(personA), yinA = yinScore(personA);
    const yangB = yangScore(personB), yinB = yinScore(personB);

    let score;
    let pattern;
    if ((yangA >= 3 && yinB >= 3) || (yinA >= 3 && yangB >= 3)) {
      score = 10; pattern = 'complementary';
    } else if (yangA >= 2 && yangB >= 2 && yinA <= 1 && yinB <= 1) {
      score = 5;  pattern = 'both_yang';
    } else if (yinA >= 2 && yinB >= 2 && yangA <= 1 && yangB <= 1) {
      score = 5;  pattern = 'both_yin';
    } else if (yangA >= 2 && yinA >= 2 || yangB >= 2 && yinB >= 2) {
      score = 8;  pattern = 'inner_balanced';
    } else {
      score = 7;  pattern = 'mixed';
    }

    return { score, pattern, yangA, yinA, yangB, yinB };
  }

  /* ========================================================================
   * 7. 红绿灯：5 项风险信号
   * ====================================================================== */

  /**
   * 通用辅助：检查某人是否符合"PUA 倾向"特征。
   * 任一子条件满足即返回 true（per P2 spec）。
   */
  function checkPUA(p) {
    if (!p) return false;
    if (p.mbti === 'ENTJ' || p.mbti === 'ESTJ') return true;
    if (p.bazi && p.bazi.dayMaster) {
      const gan = p.bazi.dayMaster.gan;
      const strong = p.bazi.shishen && p.bazi.shishen.strongest;
      if ((gan === '庚' || gan === '辛') && strong === '官杀') return true;
    }
    if (p.astro && p.astro.sun && p.astro.moon) {
      const sun = p.astro.sun.sign;
      if ((sun === '天蝎' || sun === '摩羯') && p.astro.moon.element === 'air') return true;
    }
    return false;
  }

  function checkPlayer(p) {
    if (!p) return false;
    if (p.mbti === 'ESTP' || p.mbti === 'ENFP') return true;
    if (p.bazi && p.bazi.dayMaster) {
      const gan = p.bazi.dayMaster.gan;
      const strong = p.bazi.shishen && p.bazi.shishen.strongest;
      if ((gan === '壬' || gan === '癸') && strong === '食伤') return true;
    }
    if (p.astro && p.astro.sun) {
      const sun = p.astro.sun.sign;
      if (sun === '双子' || sun === '射手') return true;
    }
    return false;
  }

  function checkMamaBaby(p) {
    if (!p) return false;
    if (p.mbti === 'ISFJ' || p.mbti === 'ESFJ') return true;
    if (p.bazi && p.bazi.shishen) {
      const c = p.bazi.shishen.counts || {};
      if ((c['印星'] || 0) >= 3) return true;
    }
    if (p.astro && p.astro.moon) {
      const m = p.astro.moon.sign;
      if (m === '巨蟹' || m === '双鱼') return true;
    }
    return false;
  }

  function checkGoldDigger(p) {
    if (!p) return false;
    if (p.mbti === 'ESFP' || p.mbti === 'ISTP') return true;
    if (p.bazi && p.bazi.shishen) {
      const c = p.bazi.shishen.counts || {};
      if ((c['比劫'] || 0) >= 3 && (c['财星'] || 0) <= 1) return true;
    }
    if (p.astro && p.astro.sun && p.astro.moon) {
      if (p.astro.sun.sign === '金牛' && p.astro.moon.sign === '金牛') return true;
    }
    return false;
  }

  function checkEmotionalChaos(p) {
    if (!p) return false;
    if (p.mbti === 'ISFP' || p.mbti === 'INFP') return true;
    if (p.bazi && p.bazi.dayMaster) {
      const gan = p.bazi.dayMaster.gan;
      const fire = p.bazi.fiveElements ? p.bazi.fiveElements.fire : 0;
      if (gan === '丁' && fire <= 1) return true;
    }
    if (p.astro && p.astro.moon && p.astro.sun) {
      const moon = p.astro.moon.sign;
      if ((moon === '巨蟹' || moon === '天蝎') && signAngle(p.astro.sun.index, p.astro.moon.index) === 6) {
        return true;
      }
    }
    return false;
  }

  const SIGNAL_TEMPLATES = {
    pua: {
      title: 'PUA 倾向',
      message: '小心，TA 会让你觉得"是你不够好"。但实际上：让你感觉糟糕的人，不爱你。TA 在你面前的"冷静"，是控制欲披上了理性的外衣。',
    },
    player: {
      title: '多情花心',
      message: 'TA 不是不爱你，TA 是不会停在任何一个人身上。不要试图改变 TA，要么接受这个版本，要么走人。',
    },
    mamababy: {
      title: '妈宝 / 扶弟魔',
      message: 'TA 妈打电话的频率高于你们日常聊天的频率时，醒醒吧。你嫁的不是 TA 一个人，是 TA 一家人。',
    },
    golddigger: {
      title: '拜金 / 吸血',
      message: 'TA 不是爱你，是爱"有你能用"。分清楚 TA 是爱你这个人，还是爱你身上的资源。',
    },
    emotional: {
      title: '情绪不稳 / 冷暴力',
      message: 'TA 爱你时把你捧上天，不爱时把你摔下地。这种过山车不是浪漫，是消耗。',
    }
  };

  const DISCLAIMER = '※ 以上判断基于性格统计倾向，不代表具体个体行为，仅供参考。';

  /**
   * 检测红绿灯。对 A 和 B 各做一次检测，目标方用 'A' / 'B' 区分。
   */
  function detectRiskSignals(personA, personB /* , relationType */) {
    const signals = [];

    function addIfHit(personObj, target, checkFn, signalKey) {
      if (checkFn(personObj)) {
        const tpl = SIGNAL_TEMPLATES[signalKey];
        signals.push({
          id: signalKey,
          target,                       // 'A' | 'B' — 表示风险来自哪一方
          targetName: personObj && personObj.nickname,
          title: tpl.title,
          message: tpl.message,
          disclaimer: DISCLAIMER
        });
      }
    }

    // 对方（B）的 5 项 risk
    addIfHit(personB, 'B', checkPUA,            'pua');
    addIfHit(personB, 'B', checkPlayer,         'player');
    addIfHit(personB, 'B', checkMamaBaby,       'mamababy');
    addIfHit(personB, 'B', checkGoldDigger,     'golddigger');
    addIfHit(personB, 'B', checkEmotionalChaos, 'emotional');

    // 自己（A）的 5 项 risk（同样检测，让用户知道自己也可能是被警惕的一方）
    addIfHit(personA, 'A', checkPUA,            'pua');
    addIfHit(personA, 'A', checkPlayer,         'player');
    addIfHit(personA, 'A', checkMamaBaby,       'mamababy');
    addIfHit(personA, 'A', checkGoldDigger,     'golddigger');
    addIfHit(personA, 'A', checkEmotionalChaos, 'emotional');

    // 总和判定按"B 的红旗数量"（用户最关心对方风险）
    const bCount = signals.filter(s => s.target === 'B').length;
    let level;
    if (bCount === 0) level = 'green';
    else if (bCount === 1) level = 'yellow';
    else if (bCount === 2) level = 'orange';
    else level = 'red';

    return {
      signals,
      level,
      count: signals.length,
      bCount,
      aCount: signals.length - bCount
    };
  }

  /* ========================================================================
   * 8. 流行梗建议筛选（在 popular-advice.js 加载后才有数据）
   * ====================================================================== */

  /**
   * 根据匹配结果选 5-8 条最相关建议。
   * 优先级：类型组合特化 > 红旗专属 > 关系类型通用 > 兜底通用
   */
  function selectAdvice(personA, personB, matchSnapshot) {
    const lib = window.POPULAR_ADVICE || { general: [], typed: {} };
    const selected = [];
    const seenIds = new Set();

    function pushUnique(adviceItem) {
      if (!adviceItem) return;
      const id = adviceItem.id || JSON.stringify(adviceItem).slice(0, 40);
      if (seenIds.has(id)) return;
      seenIds.add(id);
      selected.push(adviceItem);
    }

    // 1. 类型组合特化（双向匹配）
    const typeKey1 = personA.mbti + '_' + personB.mbti;
    const typeKey2 = personB.mbti + '_' + personA.mbti;
    const typedAdv = (lib.typed[typeKey1] || lib.typed[typeKey2] || []);
    typedAdv.slice(0, 2).forEach(pushUnique);

    // 2. 红旗专属建议（按 signal id 匹配 keywords）
    if (matchSnapshot && matchSnapshot.signals) {
      for (const sig of matchSnapshot.signals) {
        const matched = (lib.general || []).filter(a =>
          a.keywords && a.keywords.some(k => k.toLowerCase().includes(sig.id))
        );
        matched.slice(0, 1).forEach(pushUnique);
      }
    }

    // 3. 关系类型通用 + 兜底通用
    (lib.general || []).forEach(pushUnique);

    return selected.slice(0, 8);
  }

  /* ========================================================================
   * 9. 主入口 calcMatching
   * ====================================================================== */

  /**
   * @param personA - { nickname, gender, mbti, bazi, astro }
   * @param personB - 同上
   * @param relationType - 'love' | 'marriage' | 'friend' | 'partner' | 'colleague'
   */
  function calcMatching(personA, personB, relationType) {
    relationType = relationType || 'love';

    const mbtiResult     = calcMBTICompat(personA.mbti, personB.mbti);
    const baziResult     = calcBaziCompat(personA.bazi, personB.bazi, relationType);
    const astroResult    = calcAstrologyCompat(personA.astro, personB.astro);
    const yinYangResult  = calcYinYang(personA, personB);

    const totalScore =
        (mbtiResult     ? mbtiResult.score     : 0)
      + (baziResult     ? baziResult.score     : 0)
      + (astroResult    ? astroResult.score    : 0)
      + (yinYangResult  ? yinYangResult.score  : 0);

    const riskResult = detectRiskSignals(personA, personB, relationType);

    const matchSnapshot = { totalScore, signals: riskResult.signals };
    const popularAdvice = selectAdvice(personA, personB, matchSnapshot);

    // 评级
    let grade;
    if (totalScore >= 85) grade = 'A+';
    else if (totalScore >= 75) grade = 'A';
    else if (totalScore >= 65) grade = 'B+';
    else if (totalScore >= 55) grade = 'B';
    else if (totalScore >= 45) grade = 'C';
    else grade = 'D';

    return {
      totalScore,
      grade,
      relationType,
      // 子分数
      mbtiScore:    mbtiResult    ? mbtiResult.score    : 0,
      baziScore:    baziResult    ? baziResult.score    : 0,
      astroScore:   astroResult   ? astroResult.score   : 0,
      yinYangScore: yinYangResult ? yinYangResult.score : 0,
      // 子结果（含元数据）
      mbtiResult,
      baziResult,
      astroResult,
      yinYangResult,
      // 红绿灯
      signals: riskResult.signals,
      signalsLevel: riskResult.level,
      signalsBCount: riskResult.bCount,
      signalsACount: riskResult.aCount,
      // 建议
      popularAdvice,
      // 原始 person 数据（便于 UI 渲染时引用）
      personA,
      personB
    };
  }

  /* ========================================================================
   * 10. 测试用例运行器（需 BAZI + ASTRO 已加载）
   * ====================================================================== */

  function makePerson(nickname, gender, year, month, day, hour, city, mbti) {
    return {
      nickname,
      gender,
      mbti,
      bazi:  window.BAZI  ? window.BAZI.calcBaziComplete(year, month, day, hour, gender) : null,
      astro: window.ASTRO ? window.ASTRO.calcAstrologyComplete(year, month, day, hour, city) : null
    };
  }

  function runTests() {
    if (!window.BAZI || !window.ASTRO) {
      return [{ error: 'BAZI / ASTRO not loaded — load order issue' }];
    }

    const cases = [
      {
        name: '案例 1：INTJ 男 × ENFP 女（黄金搭档 + 五行可能互补）',
        A: makePerson('阿杰', 'male',   1990, 5, 20, 14, '北京', 'INTJ'),
        B: makePerson('小米', 'female', 1992, 8, 15, 10, '上海', 'ENFP'),
        relType: 'love'
      },
      {
        name: '案例 2：ENTJ × ENTJ（双控制狂）',
        A: makePerson('老板 A', 'male',   1985, 3, 12, 9, '北京', 'ENTJ'),
        B: makePerson('老板 B', 'female', 1986, 11, 8, 16, '深圳', 'ENTJ'),
        relType: 'partner'
      },
      {
        name: '案例 3：INFJ 男 × INFJ 女（同质化）',
        A: makePerson('小J',  'male',   1993, 9, 3, 7,  '杭州', 'INFJ'),
        B: makePerson('小J\'','female', 1994, 9, 30, 19, '杭州', 'INFJ'),
        relType: 'love'
      }
    ];

    return cases.map(c => {
      try {
        const r = calcMatching(c.A, c.B, c.relType);
        return {
          name: c.name,
          totalScore: r.totalScore,
          grade: r.grade,
          mbtiScore: r.mbtiScore + '/30',
          baziScore: r.baziScore + '/35',
          astroScore: r.astroScore + '/25',
          yinYangScore: r.yinYangScore + '/10',
          mbtiType: r.mbtiResult && r.mbtiResult.type,
          baziRelation: r.baziResult && r.baziResult.relation,
          sunRelation: r.astroResult && r.astroResult.sunRelation,
          yinYangPattern: r.yinYangResult && r.yinYangResult.pattern,
          signalsLevel: r.signalsLevel,
          signalsBCount: r.signalsBCount,
          signalsACount: r.signalsACount
        };
      } catch (e) {
        return { name: c.name, error: String(e) };
      }
    });
  }

  /* ========================================================================
   * 11. 对外暴露
   * ====================================================================== */

  window.MATCHING_ENGINE.calcMBTICompat      = calcMBTICompat;
  window.MATCHING_ENGINE.calcBaziCompat      = calcBaziCompat;
  window.MATCHING_ENGINE.calcAstrologyCompat = calcAstrologyCompat;
  window.MATCHING_ENGINE.calcYinYang         = calcYinYang;
  window.MATCHING_ENGINE.detectRiskSignals   = detectRiskSignals;
  window.MATCHING_ENGINE.selectAdvice        = selectAdvice;
  window.MATCHING_ENGINE.calcMatching        = calcMatching;
  window.MATCHING_ENGINE.runTests            = runTests;

  // 内部辅助也暴露（调试 / 单测用）
  window.MATCHING_ENGINE._internal = {
    letterDiff, isGoldenPair, mbtiFamily,
    fiveElementRelation, signAngle,
    checkPUA, checkPlayer, checkMamaBaby, checkGoldDigger, checkEmotionalChaos,
    GOLDEN_PAIRS, BAZI_SCORE_TABLE, SIGNAL_TEMPLATES, DISCLAIMER
  };
})();
