/*!
 * libs/bazi.js — 八字排盘（诚实重量级）
 * --------------------------------------------------------------
 * 命名空间：window.BAZI
 *
 * 算法核心：
 *   1. 太阳黄经：Meeus 简化算法，精度优于 0.01°（远高于 15° 节气精度要求）
 *   2. 立春定年柱：黄经达到 315° 之刻才进入新年柱
 *   3. 节气定月柱：12 个"节"对应 12 月柱
 *   4. JDN 日数差定日柱：基准 1900-01-31 = 甲辰
 *   5. 五鼠遁定时柱：晚子时（23:00-23:59）归次日
 *   6. 五行：天干本气 + 地支本气（不取藏干，避免复杂）
 *   7. 简版十神：5 大类（不分正偏比劫）
 *
 * 输入约定：
 *   - year/month/day: 公历（Gregorian）
 *   - hour: 0-23 整数，或 null（不知道时辰）
 *   - 默认时区: GMT+8（北京时间）
 *
 * 验证用经典测试用例（详见文末 BAZI.runTests）：
 *   1990-05-20 14:00 → 庚午 辛巳 乙酉 癸未
 *   2000-12-31 23:00 → 庚辰 戊子 癸亥 甲子（晚子时归次日）
 *   1893-12-26 07:00 → 癸巳 甲子 丁酉 甲辰（毛泽东八字，公开史料）
 */
(function () {
  'use strict';

  window.BAZI = window.BAZI || {};

  /* ========================================================================
   * 1. 常量与查表
   * ====================================================================== */

  // 天干（0-9）
  const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 地支（0-11，从子开始）
  const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 天干五行：甲乙木 / 丙丁火 / 戊己土 / 庚辛金 / 壬癸水
  const GAN_ELEMENT = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
  // 天干阴阳：阳=true（甲丙戊庚壬），阴=false（乙丁己辛癸）
  const GAN_YANG = [true, false, true, false, true, false, true, false, true, false];

  // 地支本气五行：子=水 / 丑=土 / 寅=木 / 卯=木 / 辰=土 / 巳=火 / 午=火 / 未=土 / 申=金 / 酉=金 / 戌=土 / 亥=水
  const ZHI_ELEMENT = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

  // 五行生克
  // 生（A 生 B）：木→火→土→金→水→木
  const ELEMENT_GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
  // 克（A 克 B）：木→土→水→火→金→木
  const ELEMENT_CONTROLS = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

  // 五虎遁：寅月（正月）起干表，按"年干 % 5"索引
  //   甲己之年(0/5 → mod5=0)：丙(2)寅
  //   乙庚之年(1/6 → mod5=1)：戊(4)寅
  //   丙辛之年(2/7 → mod5=2)：庚(6)寅
  //   丁壬之年(3/8 → mod5=3)：壬(8)寅
  //   戊癸之年(4/9 → mod5=4)：甲(0)寅
  const YIN_MONTH_START_GAN = [2, 4, 6, 8, 0];

  // 五鼠遁：子时起干表，按"日干 % 5"索引
  //   甲己之日(0/5 → mod5=0)：甲(0)子
  //   乙庚之日(1/6 → mod5=1)：丙(2)子
  //   丙辛之日(2/7 → mod5=2)：戊(4)子
  //   丁壬之日(3/8 → mod5=3)：庚(6)子
  //   戊癸之日(4/9 → mod5=4)：壬(8)子
  const ZI_HOUR_START_GAN = [0, 2, 4, 6, 8];

  // 月支按"寅月偏移"（寅=0, 卯=1, ..., 丑=11）→ 转换为 ZHI 数组的索引（子=0, ..., 亥=11）
  // 寅=2, 卯=3, 辰=4, 巳=5, 午=6, 未=7, 申=8, 酉=9, 戌=10, 亥=11, 子=0, 丑=1
  function yinOffsetToZhiIndex(yinOffset) {
    return (yinOffset + 2) % 12;
  }

  // 五行中文名（仅用于摘要文本，主数据用英文键）
  const ELEMENT_CN = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };

  /* ========================================================================
   * 2. 历法核心：JDN（儒略日数）与太阳黄经
   * ====================================================================== */

  /**
   * 公历日期转 JDN（午夜时刻的整数 JDN）。
   * 标准 Fliegel 算法，对公元 1583 年以后任意日期精确。
   */
  function gregorianToJDN(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day
      + Math.floor((153 * m + 2) / 5)
      + 365 * y
      + Math.floor(y / 4)
      - Math.floor(y / 100)
      + Math.floor(y / 400)
      - 32045;
  }

  /**
   * 公历日期+小时 转 JD（带小数的 Julian Day，参考时 0 = JD 2451545.0 = 2000-01-01 12:00 UT）。
   * 输入的 hour 视为北京时间（GMT+8）。
   */
  function julianDay(year, month, day, hour) {
    const utHour = hour - 8; // 转 UT
    let Y = year, M = month;
    const D = day + utHour / 24;
    if (M <= 2) { Y -= 1; M += 12; }
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (Y + 4716))
      + Math.floor(30.6001 * (M + 1))
      + D + B - 1524.5;
  }

  /**
   * 太阳视黄经（apparent geocentric longitude），单位度，范围 [0, 360)。
   * Meeus《Astronomical Algorithms》简化算法，1900-2050 年精度优于 0.01°。
   * 对节气定位（每 15°一个节气）来说远超必要精度。
   */
  function solarLongitude(year, month, day, hour) {
    const JD = julianDay(year, month, day, hour);
    const T = (JD - 2451545.0) / 36525;

    // 太阳平近点角
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000;
    const Mr = M * Math.PI / 180;

    // 太阳平黄经
    const L0 = 280.4664567 + 36000.76982779 * T + 0.0003032 * T * T - T * T * T / 49931;

    // 中心方程
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
            + 0.000289 * Math.sin(3 * Mr);

    // 真黄经
    const trueLong = L0 + C;

    // 章动 + 光行差修正
    const omega = (125.04 - 1934.136 * T) * Math.PI / 180;
    const apparent = trueLong - 0.00569 - 0.00478 * Math.sin(omega);

    return ((apparent % 360) + 360) % 360;
  }

  /* ========================================================================
   * 3. 函数 1：calcYearPillar
   * ====================================================================== */

  /**
   * 计算年柱。立春（黄经 315°）为界。
   * 出生于公历 1 月、或 2 月立春之前 → 用上一年；否则用当年。
   */
  function calcYearPillar(year, month, day, hour) {
    let effectiveYear = year;

    // 仅当生月 ≤ 2 时才需精确判断立春
    if (month <= 2) {
      const h = (hour == null) ? 12 : hour;
      const lambda = solarLongitude(year, month, day, h);
      // 立春前：lambda 处于 [冬至 270° ~ 立春 315°)
      // 立春后到春分前：lambda 处于 [315° ~ 360°)
      // 注意：2 月底 lambda 已超过 315 但小于 360，月份是 2，所以不能仅靠 lambda < 315 判断
      if (lambda < 315 && lambda > 200) {
        // 仍在前一年的年柱内（黄经还没追到 315°）
        effectiveYear = year - 1;
      }
    }

    const idx = ((effectiveYear - 4) % 60 + 60) % 60;
    return {
      ganIdx: idx % 10,
      zhiIdx: idx % 12,
      gan: GAN[idx % 10],
      zhi: ZHI[idx % 12],
      pillar: GAN[idx % 10] + ZHI[idx % 12],
      effectiveYear
    };
  }

  /* ========================================================================
   * 4. 函数 2：calcMonthPillar
   * ====================================================================== */

  /**
   * 计算月柱。月支按"节"分界（不是节气！只有"节"才换月），共 12 个：
   *   立春315 / 惊蛰345 / 清明15 / 立夏45 / 芒种75 / 小暑105
   *   立秋135 / 白露165 / 寒露195 / 立冬225 / 大雪255 / 小寒285
   * 月干用五虎遁。
   */
  function calcMonthPillar(year, month, day, hour, yearGanIdx) {
    const h = (hour == null) ? 12 : hour;
    const lambda = solarLongitude(year, month, day, h);

    // 寅月起：从 315° 开始，每 30° 一个月（注意 315° 是"节"立春，月份切换点）
    // 把黄经映射到"从立春算起的偏移"
    let lambdaFromLichun = lambda - 315;
    if (lambdaFromLichun < 0) lambdaFromLichun += 360;
    const yinOffset = Math.floor(lambdaFromLichun / 30); // 0=寅, 1=卯, ..., 11=丑

    const zhiIdx = yinOffsetToZhiIndex(yinOffset); // 转 ZHI 数组索引
    const startGan = YIN_MONTH_START_GAN[yearGanIdx % 5];
    const ganIdx = (startGan + yinOffset) % 10;

    return {
      ganIdx,
      zhiIdx,
      gan: GAN[ganIdx],
      zhi: ZHI[zhiIdx],
      pillar: GAN[ganIdx] + ZHI[zhiIdx]
    };
  }

  /* ========================================================================
   * 5. 函数 3：calcDayPillar
   * ====================================================================== */

  // 基准：1900-01-31 = 甲辰日（已查证）
  //   甲(0)辰(4) 在 60 甲子中位置 = 40（因 0 mod 10 = 0 且 40 mod 12 = 4）
  const DAY_BASE_JDN = 2415051;   // gregorianToJDN(1900, 1, 31)
  const DAY_BASE_IDX = 40;        // 甲辰

  /**
   * 计算日柱。日数差法，精确到天，无歧义。
   */
  function calcDayPillar(year, month, day) {
    const jdn = gregorianToJDN(year, month, day);
    const diff = jdn - DAY_BASE_JDN;
    const idx = ((DAY_BASE_IDX + diff) % 60 + 60) % 60;
    return {
      jdn,
      cycleIdx: idx,
      ganIdx: idx % 10,
      zhiIdx: idx % 12,
      gan: GAN[idx % 10],
      zhi: ZHI[idx % 12],
      pillar: GAN[idx % 10] + ZHI[idx % 12]
    };
  }

  /* ========================================================================
   * 6. 函数 4：calcHourPillar
   * ====================================================================== */

  /**
   * 计算时柱。
   *
   * 时辰对照（按 hour，0-23）：
   *   23-0:59 子(0) | 1-2:59 丑(1) | 3-4:59 寅(2) | 5-6:59 卯(3)
   *   7-8:59 辰(4) | 9-10:59 巳(5) | 11-12:59 午(6) | 13-14:59 未(7)
   *   15-16:59 申(8) | 17-18:59 酉(9) | 19-20:59 戌(10) | 21-22:59 亥(11)
   *
   * ⚠️ 晚子时规则：23:00-23:59 视为次日子时，
   *    时干用次日的日干起五鼠遁（日柱本身保持当日不变，遵循"日柱不跨夜"惯例）。
   */
  function calcHourPillar(dayGanIdx, hour, year, month, day) {
    if (hour == null) return null;

    let effectiveDayGanIdx = dayGanIdx;
    let zhiIdx;

    if (hour === 23) {
      // 晚子时：时支 = 子，时干起遁用次日日干
      zhiIdx = 0;
      const nextDay = calcDayPillar(year, month, day + 1);
      effectiveDayGanIdx = nextDay.ganIdx;
    } else {
      // 标准映射：(hour + 1) / 2 取整 mod 12
      zhiIdx = Math.floor((hour + 1) / 2) % 12;
    }

    const startGan = ZI_HOUR_START_GAN[effectiveDayGanIdx % 5];
    const ganIdx = (startGan + zhiIdx) % 10;

    return {
      ganIdx,
      zhiIdx,
      gan: GAN[ganIdx],
      zhi: ZHI[zhiIdx],
      pillar: GAN[ganIdx] + ZHI[zhiIdx]
    };
  }

  /* ========================================================================
   * 7. 函数 5：calcFiveElements
   * ====================================================================== */

  /**
   * 计算五行分布。
   * 每个天干算 1，每个地支算 1（仅本气，不取藏干）。
   * 时柱未知时总分 6，否则总分 8。
   */
  function calcFiveElements(pillars) {
    const count = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

    function addPillar(p) {
      if (!p) return;
      count[GAN_ELEMENT[p.ganIdx]] += 1;
      count[ZHI_ELEMENT[p.zhiIdx]] += 1;
    }

    addPillar(pillars.year);
    addPillar(pillars.month);
    addPillar(pillars.day);
    addPillar(pillars.hour); // 可能为 null

    const total = (pillars.hour ? 8 : 6);

    // 最旺/最弱
    const order = ['wood', 'fire', 'earth', 'metal', 'water'];
    let strongest = order[0], weakest = order[0];
    for (const e of order) {
      if (count[e] > count[strongest]) strongest = e;
      if (count[e] < count[weakest]) weakest = e;
    }

    return {
      wood: count.wood,
      fire: count.fire,
      earth: count.earth,
      metal: count.metal,
      water: count.water,
      total,
      strongest,
      weakest
    };
  }

  /* ========================================================================
   * 8. 函数 6：calcDayMaster
   * ====================================================================== */

  /**
   * 日主信息：日干本身 + 五行 + 阴阳 + 简短描述。
   * 详细文案位于 matching-data.js 的 dayMasterDesc，此处只回 key 与简要。
   */
  const DAY_MASTER_SHORT = {
    '甲': '甲木 · 参天大树。挺拔有担当，但易硬抗。',
    '乙': '乙木 · 藤蔓花草。柔韧灵活，但需依附。',
    '丙': '丙火 · 太阳。明亮热情，但易过度散发。',
    '丁': '丁火 · 灯烛。温暖细腻，但需被守护。',
    '戊': '戊土 · 山岳。厚重稳定，但难撼动。',
    '己': '己土 · 田园。包容滋养，但需被耕耘。',
    '庚': '庚金 · 刀剑。果断锋利，但易折也易伤。',
    '辛': '辛金 · 珠玉。精致敏锐，但需被珍视。',
    '壬': '壬水 · 江河。奔涌深邃，但难收敛。',
    '癸': '癸水 · 雨露。润物无声，但易蒸发。'
  };

  function calcDayMaster(dayPillar) {
    const gan = dayPillar.gan;
    const ganIdx = dayPillar.ganIdx;
    return {
      gan,
      ganIdx,
      element: GAN_ELEMENT[ganIdx],
      elementCN: ELEMENT_CN[GAN_ELEMENT[ganIdx]],
      yinYang: GAN_YANG[ganIdx] ? 'yang' : 'yin',
      yinYangCN: GAN_YANG[ganIdx] ? '阳' : '阴',
      description: DAY_MASTER_SHORT[gan] || ''
    };
  }

  /* ========================================================================
   * 9. 函数 7：calcSimpleShiShen
   * ====================================================================== */

  /**
   * 简版十神（不分正偏，仅 5 大类）：
   *   同我者 → 比劫
   *   我生者 → 食伤
   *   我克者 → 财星
   *   克我者 → 官杀
   *   生我者 → 印星
   *
   * 输入：日主 + 其他天干（年/月/时），共 3 个（无时柱则 2 个）。
   * 注意：地支本气也参与（共最多 7 项，不算日主天干本身）。
   */
  function classifyShiShen(dayElement, otherElement) {
    if (dayElement === otherElement) return '比劫';
    if (ELEMENT_GENERATES[dayElement] === otherElement) return '食伤';
    if (ELEMENT_CONTROLS[dayElement] === otherElement) return '财星';
    if (ELEMENT_CONTROLS[otherElement] === dayElement) return '官杀';
    if (ELEMENT_GENERATES[otherElement] === dayElement) return '印星';
    return null;
  }

  function calcSimpleShiShen(dayMaster, pillars) {
    const count = { '比劫': 0, '食伤': 0, '财星': 0, '官杀': 0, '印星': 0 };
    const dayEl = dayMaster.element;

    // 收集所有"其他"元素：年/月/时的天干 + 全部 4 柱的地支
    const others = [];
    if (pillars.year)  { others.push(GAN_ELEMENT[pillars.year.ganIdx]);  others.push(ZHI_ELEMENT[pillars.year.zhiIdx]); }
    if (pillars.month) { others.push(GAN_ELEMENT[pillars.month.ganIdx]); others.push(ZHI_ELEMENT[pillars.month.zhiIdx]); }
    // 日柱地支也算（日干本身不算，避免日主自比）
    if (pillars.day)   { others.push(ZHI_ELEMENT[pillars.day.zhiIdx]); }
    if (pillars.hour)  { others.push(GAN_ELEMENT[pillars.hour.ganIdx]);  others.push(ZHI_ELEMENT[pillars.hour.zhiIdx]); }

    for (const el of others) {
      const sh = classifyShiShen(dayEl, el);
      if (sh) count[sh] += 1;
    }

    // 找最旺
    let strongest = '比劫';
    for (const k of Object.keys(count)) {
      if (count[k] > count[strongest]) strongest = k;
    }

    const desc = {
      '比劫': '比劫多者，朋友多、行动力强，但易破财，钱留不住。',
      '食伤': '食伤多者，才华横溢、表达力强，但易耗精神，重感情。',
      '财星': '财星多者，懂赚钱、务实，但易陷物欲，感情上易反复。',
      '官杀': '官杀多者，扛事、有压力承受力，但易被人管，活得不轻松。',
      '印星': '印星多者，被庇护、学习好，但易依赖他人，独立能力弱。'
    };

    return {
      counts: count,
      strongest,
      description: desc[strongest] || ''
    };
  }

  /* ========================================================================
   * 10. 函数 8：calcBaziComplete（主入口）
   * ====================================================================== */

  /**
   * 主入口：传入公历年月日时与性别，返回完整命盘。
   *
   * @param {number} year   公历年
   * @param {number} month  公历月 1-12
   * @param {number} day    公历日 1-31
   * @param {number|null} hour 北京时间 0-23，或 null 表示不知道时辰
   * @param {string} gender 'male' | 'female'
   * @return 完整命盘对象
   */
  function calcBaziComplete(year, month, day, hour, gender) {
    // 1. 年柱
    const yearP  = calcYearPillar(year, month, day, hour);
    // 2. 月柱
    const monthP = calcMonthPillar(year, month, day, hour, yearP.ganIdx);
    // 3. 日柱
    const dayP   = calcDayPillar(year, month, day);
    // 4. 时柱
    const hourP  = calcHourPillar(dayP.ganIdx, hour, year, month, day);

    const pillars = { year: yearP, month: monthP, day: dayP, hour: hourP };

    // 5. 五行分布
    const five = calcFiveElements(pillars);
    // 6. 日主
    const master = calcDayMaster(dayP);
    // 7. 简版十神
    const shishen = calcSimpleShiShen(master, pillars);

    // 8. 简短摘要文案
    const pillarsStr = [yearP.pillar, monthP.pillar, dayP.pillar, hourP ? hourP.pillar : '时柱未知'].join(' · ');
    const fiveStr = `木${five.wood} 火${five.fire} 土${five.earth} 金${five.metal} 水${five.water}`;
    const summary = `命盘：${pillarsStr}\n` +
                    `五行：${fiveStr}（最旺 ${ELEMENT_CN[five.strongest]}，最弱 ${ELEMENT_CN[five.weakest]}）\n` +
                    `日主：${master.gan}${master.yinYangCN}${master.elementCN} —— ${master.description}\n` +
                    `主导十神：${shishen.strongest} —— ${shishen.description}`;

    if (hourP == null) {
      // 时辰未知的诚实告知
      const note = '※ 时柱未知，丢失约 20% 命盘信息（时辰主青年/儿女宫位）；主体判断仍可信。';
      return {
        input: { year, month, day, hour, gender },
        pillars,
        fiveElements: five,
        dayMaster: master,
        shishen,
        summary: summary + '\n' + note,
        hourUnknown: true
      };
    }

    return {
      input: { year, month, day, hour, gender },
      pillars,
      fiveElements: five,
      dayMaster: master,
      shishen,
      summary,
      hourUnknown: false
    };
  }

  /* ========================================================================
   * 11. 测试用例运行器（用于验收）
   * ====================================================================== */

  /**
   * 运行经典测试用例并返回结果数组。
   * 用法：在浏览器 console 中执行 `BAZI.runTests()` 查看输出。
   */
  function runTests() {
    const cases = [
      {
        name: '1990-05-20 14:00 男（任意虚构生日）',
        input: [1990, 5, 20, 14, 'male'],
        expected: { year: '庚午', month: '辛巳', day: '乙酉', hour: '癸未' }
      },
      {
        name: '2000-12-31 23:00 男（晚子时跨日测试）',
        input: [2000, 12, 31, 23, 'male'],
        expected: { year: '庚辰', month: '戊子', day: '癸亥', hour: '甲子' }
      },
      {
        name: '1893-12-26 07:00 男（毛泽东 · 公开史料）',
        input: [1893, 12, 26, 7, 'male'],
        expected: { year: '癸巳', month: '甲子', day: '丁酉', hour: '甲辰' }
      },
      {
        name: '1984-02-04 12:00 男（甲子年元日，立春当日中午）',
        input: [1984, 2, 4, 12, 'male'],
        expected: '约立春关口，年柱介于 癸亥 / 甲子，月柱 丙寅 / 乙丑'
      },
      {
        name: '1900-01-31 12:00 男（日柱基准点）',
        input: [1900, 1, 31, 12, 'male'],
        expected: { day: '甲辰（基准日）' }
      }
    ];

    const results = [];
    for (const c of cases) {
      try {
        const r = calcBaziComplete.apply(null, c.input);
        results.push({
          name: c.name,
          expected: c.expected,
          actual: {
            year: r.pillars.year.pillar,
            month: r.pillars.month.pillar,
            day: r.pillars.day.pillar,
            hour: r.pillars.hour ? r.pillars.hour.pillar : null,
            fiveElements: `木${r.fiveElements.wood} 火${r.fiveElements.fire} 土${r.fiveElements.earth} 金${r.fiveElements.metal} 水${r.fiveElements.water}`,
            dayMaster: r.dayMaster.gan + r.dayMaster.yinYangCN + r.dayMaster.elementCN,
            strongestShiShen: r.shishen.strongest
          }
        });
      } catch (e) {
        results.push({ name: c.name, error: String(e) });
      }
    }
    return results;
  }

  /* ========================================================================
   * 12. 对外暴露
   * ====================================================================== */

  window.BAZI.GAN = GAN;
  window.BAZI.ZHI = ZHI;
  window.BAZI.GAN_ELEMENT = GAN_ELEMENT;
  window.BAZI.ZHI_ELEMENT = ZHI_ELEMENT;
  window.BAZI.ELEMENT_CN = ELEMENT_CN;

  window.BAZI.solarLongitude = solarLongitude;
  window.BAZI.gregorianToJDN = gregorianToJDN;

  window.BAZI.calcYearPillar    = calcYearPillar;
  window.BAZI.calcMonthPillar   = calcMonthPillar;
  window.BAZI.calcDayPillar     = calcDayPillar;
  window.BAZI.calcHourPillar    = calcHourPillar;
  window.BAZI.calcFiveElements  = calcFiveElements;
  window.BAZI.calcDayMaster     = calcDayMaster;
  window.BAZI.calcSimpleShiShen = calcSimpleShiShen;
  window.BAZI.calcBaziComplete  = calcBaziComplete;

  window.BAZI.runTests = runTests;
})();
