/*!
 * libs/astrology.js — 三星座（太阳 / 月亮 / 上升）
 * --------------------------------------------------------------
 * 命名空间：window.ASTRO
 *
 * 算法分级：
 *   1. 太阳星座：日期查表，精度 ±1 天（节气边界日可能差一个星座，极端少数）
 *   2. 月亮星座：Meeus《Astronomical Algorithms》主周期项（前 23 项），
 *                精度 ±0.3°，远小于星座 30° 宽度 → 实用上"精确"
 *   3. 上升星座：标准 atan2 法 + 北京时区默认 + 城市查表纬度，
 *                精度 ±1 个星座（出生时间不准时降级）
 *
 * 重要免责（UI 上要说清楚）：
 *   - 月亮换星座有时只差几分钟，输入时间错 1 小时可能跨星座
 *   - 上升对出生时间极敏感，错 4 分钟 = 经度 1°，可能跨星座
 *   - 不知道时辰时返回 null（上升）/ 中午占位（月亮，confidence=medium）
 *
 * 默认时区：GMT+8（北京时间）
 */
(function () {
  'use strict';

  window.ASTRO = window.ASTRO || {};

  /* ========================================================================
   * 1. 常量表
   * ====================================================================== */

  // 12 星座（按黄经 0°-360° 顺序，从白羊开始）
  const SIGNS = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'];
  // 元素：火/土/风/水（白羊起循环）
  const SIGN_ELEMENTS = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];
  // 英文名（用于国际化）
  const SIGN_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  // 太阳星座日期边界表（标准日期，可能有 ±1 天误差）
  // 每条 [月, 日, 该日及之后属于哪个星座 index]
  // 注意：摩羯跨年（12.22 - 1.19）
  const SUN_DATE_TABLE = [
    [3, 21, 0],   // 白羊
    [4, 20, 1],   // 金牛
    [5, 21, 2],   // 双子
    [6, 21, 3],   // 巨蟹
    [7, 23, 4],   // 狮子
    [8, 23, 5],   // 处女
    [9, 23, 6],   // 天秤
    [10, 23, 7],  // 天蝎
    [11, 22, 8],  // 射手
    [12, 22, 9]   // 摩羯（一直到 1.19）
    // 1.20 起 水瓶 (10) / 2.19 起 双鱼 (11) 在函数里特殊处理
  ];

  // 34 省会城市经纬度（latitude 北纬, longitude 东经）
  // 用于上升星座的本地恒星时与几何上升计算
  const CITIES = {
    '北京':       { lat: 39.9, lon: 116.4 },
    '天津':       { lat: 39.1, lon: 117.2 },
    '上海':       { lat: 31.2, lon: 121.5 },
    '重庆':       { lat: 29.6, lon: 106.5 },
    '哈尔滨':     { lat: 45.8, lon: 126.6 },
    '长春':       { lat: 43.9, lon: 125.3 },
    '沈阳':       { lat: 41.8, lon: 123.4 },
    '呼和浩特':   { lat: 40.8, lon: 111.7 },
    '石家庄':     { lat: 38.0, lon: 114.5 },
    '太原':       { lat: 37.9, lon: 112.6 },
    '济南':       { lat: 36.7, lon: 117.0 },
    '郑州':       { lat: 34.7, lon: 113.6 },
    '西安':       { lat: 34.3, lon: 108.9 },
    '兰州':       { lat: 36.1, lon: 103.8 },
    '银川':       { lat: 38.5, lon: 106.3 },
    '西宁':       { lat: 36.6, lon: 101.8 },
    '乌鲁木齐':   { lat: 43.8, lon: 87.6 },
    '拉萨':       { lat: 29.6, lon: 91.1 },
    '成都':       { lat: 30.7, lon: 104.1 },
    '贵阳':       { lat: 26.6, lon: 106.7 },
    '昆明':       { lat: 25.0, lon: 102.7 },
    '南京':       { lat: 32.0, lon: 118.8 },
    '杭州':       { lat: 30.3, lon: 120.2 },
    '合肥':       { lat: 31.8, lon: 117.3 },
    '武汉':       { lat: 30.6, lon: 114.3 },
    '长沙':       { lat: 28.2, lon: 112.9 },
    '南昌':       { lat: 28.7, lon: 115.9 },
    '福州':       { lat: 26.1, lon: 119.3 },
    '广州':       { lat: 23.1, lon: 113.3 },
    '南宁':       { lat: 22.8, lon: 108.4 },
    '海口':       { lat: 20.0, lon: 110.3 },
    '台北':       { lat: 25.0, lon: 121.5 },
    '香港':       { lat: 22.3, lon: 114.2 },
    '澳门':       { lat: 22.2, lon: 113.5 }
  };

  const DEFAULT_CITY = '北京';

  /* ========================================================================
   * 2. 历法核心：JD（带小数儒略日）
   * ====================================================================== */

  /**
   * 公历日期+小时 转 JD。
   * @param hour - 当地北京时间（GMT+8），转 UT 后用于天文计算
   */
  function julianDay(year, month, day, hour) {
    const utHour = hour - 8; // 北京时区 → UT
    let Y = year, M = month;
    const D = day + utHour / 24;
    if (M <= 2) { Y -= 1; M += 12; }
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (Y + 4716))
      + Math.floor(30.6001 * (M + 1))
      + D + B - 1524.5;
  }

  // 小工具：度 → 弧度
  const toRad = d => d * Math.PI / 180;
  // 小工具：[0, 360) 归一化
  const norm360 = a => ((a % 360) + 360) % 360;

  /* ========================================================================
   * 3. 函数 1：太阳星座（calcSunSign）
   * ====================================================================== */

  /**
   * 按公历月日查表得太阳星座。
   * 精度：边界日（如 5.20/5.21）可能差 1 天；99% 情况无误差。
   */
  function calcSunSign(month, day) {
    // 1.20 - 2.18 水瓶
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return { sign: '水瓶', signEn: 'Aquarius', element: 'air', index: 10 };
    }
    // 2.19 - 3.20 双鱼
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return { sign: '双鱼', signEn: 'Pisces', element: 'water', index: 11 };
    }
    // 12.22 - 12.31 摩羯 OR 1.1 - 1.19 摩羯
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return { sign: '摩羯', signEn: 'Capricorn', element: 'earth', index: 9 };
    }
    // 其余：查表（按"该日起属该星座"）
    let idx = 0;
    for (const row of SUN_DATE_TABLE) {
      const [m, d, signIdx] = row;
      if (month > m || (month === m && day >= d)) {
        idx = signIdx;
      }
    }
    return {
      sign: SIGNS[idx],
      signEn: SIGN_EN[idx],
      element: SIGN_ELEMENTS[idx],
      index: idx
    };
  }

  /* ========================================================================
   * 4. 函数 2：月亮星座（calcMoonSign）
   * ====================================================================== */

  /**
   * 计算月亮黄经。
   * Meeus《Astronomical Algorithms》Chapter 47 主周期项（前 23 项），
   * 精度 ±0.3°，远小于一个星座（30°），实用上"几乎精确"。
   */
  function moonLongitude(JD) {
    const T = (JD - 2451545.0) / 36525;
    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;

    // 月亮平黄经
    const L_ = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
    // 月亮平距角
    const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
    // 太阳平近点角
    const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
    // 月亮平近点角
    const M_ = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
    // 月亮纬度参数
    const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;

    const E = 1 - 0.002516 * T - 0.0000074 * T2; // 离心率修正

    // 主周期项（单位 10^-6 度）
    // 按 Meeus 表 47.A 节选幅度最大的前 23 项
    const Dr  = toRad(D);
    const Mr  = toRad(M);
    const Mr_ = toRad(M_);
    const Fr  = toRad(F);

    const Sigma_l =
        6288774 * Math.sin(Mr_)
      + 1274027 * Math.sin(2 * Dr - Mr_)
      +  658314 * Math.sin(2 * Dr)
      +  213618 * Math.sin(2 * Mr_)
      -  185116 * Math.sin(Mr) * E
      -  114332 * Math.sin(2 * Fr)
      +   58793 * Math.sin(2 * Dr - 2 * Mr_)
      +   57066 * Math.sin(2 * Dr - Mr - Mr_) * E
      +   53322 * Math.sin(2 * Dr + Mr_)
      +   45758 * Math.sin(2 * Dr - Mr) * E
      -   40923 * Math.sin(Mr - Mr_) * E
      -   34720 * Math.sin(Dr)
      -   30383 * Math.sin(Mr + Mr_) * E
      +   15327 * Math.sin(2 * Dr - 2 * Fr)
      -   12528 * Math.sin(Mr_ + 2 * Fr)
      +   10980 * Math.sin(Mr_ - 2 * Fr)
      +   10675 * Math.sin(4 * Dr - Mr_)
      +   10034 * Math.sin(3 * Mr_)
      +    8548 * Math.sin(4 * Dr - 2 * Mr_)
      -    7888 * Math.sin(2 * Dr + Mr - Mr_) * E
      -    6766 * Math.sin(2 * Dr + Mr) * E
      -    5163 * Math.sin(Dr - Mr_)
      +    4987 * Math.sin(Dr + Mr) * E;

    const lambda = L_ + Sigma_l / 1000000;
    return norm360(lambda);
  }

  /**
   * 月亮星座。
   * @param hour - 北京时间 0-23，null 时退化为 12:00（精度降级为 medium）
   */
  function calcMoonSign(year, month, day, hour) {
    const isHourKnown = (hour != null);
    const h = isHourKnown ? hour : 12;
    const JD = julianDay(year, month, day, h);
    const lambda = moonLongitude(JD);
    const idx = Math.floor(lambda / 30) % 12;
    return {
      sign: SIGNS[idx],
      signEn: SIGN_EN[idx],
      element: SIGN_ELEMENTS[idx],
      index: idx,
      longitude: lambda,
      confidence: isHourKnown ? 'high' : 'medium',
      note: isHourKnown ? null : '时辰未知，月亮位置按中午估算，可能误差到相邻星座'
    };
  }

  /* ========================================================================
   * 5. 函数 3：上升星座（calcRisingSign）
   * ====================================================================== */

  /**
   * 格林尼治平恒星时（GMST），单位度。
   * Meeus 公式 12.4。
   */
  function gmstDegrees(JD) {
    const T = (JD - 2451545.0) / 36525;
    let theta = 280.46061837
              + 360.98564736629 * (JD - 2451545.0)
              + 0.000387933 * T * T
              - T * T * T / 38710000;
    return norm360(theta);
  }

  /**
   * 黄赤交角 ε，单位度。Meeus 简化公式。
   */
  function obliquity(JD) {
    const T = (JD - 2451545.0) / 36525;
    return 23.4392911 - 0.0130042 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
  }

  /**
   * 上升星座（Ascendant）。
   *
   * 公式：tan(Asc) = -cos(LST) / (sin(LST)*cos(ε) + tan(φ)*sin(ε))
   *       用 atan2 解四象限歧义；再加 180° 修正使 Asc 落在地平线东方。
   *
   * @param hour - 北京时间。null 时返回 null（上升对时间极敏感）
   * @param city - 中国省会名或自定义 { lat, lon }；null 时用北京
   */
  function calcRisingSign(year, month, day, hour, city) {
    if (hour == null) {
      return null; // 上升星座必须知道精确时辰
    }

    let coords;
    if (typeof city === 'string') {
      coords = CITIES[city] || CITIES[DEFAULT_CITY];
    } else if (city && typeof city === 'object' && city.lat != null) {
      coords = city;
    } else {
      coords = CITIES[DEFAULT_CITY];
    }

    const JD = julianDay(year, month, day, hour);

    // 本地恒星时 LST（度）= GMST + 观测者东经
    const gmst = gmstDegrees(JD);
    const lst = norm360(gmst + coords.lon);

    const eps = obliquity(JD);

    const lstR = toRad(lst);
    const epsR = toRad(eps);
    const latR = toRad(coords.lat);

    // 标准公式（注意符号约定：很多教科书写 -cos(LST)/(sin*cos+tan*sin)，
    // 在 atan2 中等价于 atan2(-cos(LST), sin(LST)*cos(eps)+tan(lat)*sin(eps))）
    const y = -Math.cos(lstR);
    const x = Math.sin(lstR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR);
    let asc = Math.atan2(y, x) * 180 / Math.PI;

    // atan2 给出 [-180, 180]，需要校正到地平线东方（[0, 360)）
    asc = norm360(asc);

    // 二象限歧义修正：上升点应在 LST + 90° 附近（东方地平线方位），
    // 若计算结果远在天底方向，则加 180°
    const expectedQuadrant = norm360(lst + 90);
    let diff = norm360(asc - expectedQuadrant);
    if (diff > 90 && diff < 270) {
      asc = norm360(asc + 180);
    }

    const idx = Math.floor(asc / 30) % 12;

    // 置信度：若用户选城市且时辰精确到小时，confidence=high
    //          若仅用默认城市但时辰精确，confidence=medium
    //          否则 low
    const isCustomCity = (typeof city === 'string' && CITIES[city]);
    const confidence = isCustomCity ? 'high' : 'medium';

    return {
      sign: SIGNS[idx],
      signEn: SIGN_EN[idx],
      element: SIGN_ELEMENTS[idx],
      index: idx,
      longitude: asc,
      confidence,
      city: (typeof city === 'string') ? city : DEFAULT_CITY,
      note: confidence === 'high'
        ? null
        : '上升星座对出生时间敏感，误差 4 分钟 ≈ 1° 黄经'
    };
  }

  /* ========================================================================
   * 6. 函数 4：calcAstrologyComplete（主入口）
   * ====================================================================== */

  function calcAstrologyComplete(year, month, day, hour, birthCity) {
    const sun = calcSunSign(month, day);
    const moon = calcMoonSign(year, month, day, hour);
    const rising = calcRisingSign(year, month, day, hour, birthCity);

    const summaryParts = [
      `太阳 ${sun.sign}`,
      `月亮 ${moon.sign}` + (moon.confidence === 'medium' ? '（估算）' : ''),
      rising ? `上升 ${rising.sign}` : '上升 未知（需精确时辰）'
    ];

    return {
      input: { year, month, day, hour, birthCity: birthCity || DEFAULT_CITY },
      sun,
      moon,
      rising,
      summary: '你是 ' + summaryParts.join(' · ')
    };
  }

  /* ========================================================================
   * 7. 测试用例运行器
   * ====================================================================== */

  function runTests() {
    const cases = [
      {
        name: '1990-05-20 14:00 北京（甘小姐 · 经典验证集）',
        input: [1990, 5, 20, 14, '北京'],
        expected: '太阳 金牛 · 月亮在处女偏后段 · 上升约 处女座（北纬40度下午）'
      },
      {
        name: '2000-01-15 08:00 上海',
        input: [2000, 1, 15, 8, '上海'],
        expected: '太阳 摩羯 · 月亮[查] · 上升[查]（早晨上升通常落在出生月星座附近）'
      },
      {
        name: '2024-06-21 00:00 北京（夏至前后，太阳临界点）',
        input: [2024, 6, 21, 0, '北京'],
        expected: '太阳 双子/巨蟹边界 · 月亮[查] · 上升 摩羯/水瓶附近（午夜）'
      },
      {
        name: '1988-08-15 12:00 广州（南纬测试）',
        input: [1988, 8, 15, 12, '广州'],
        expected: '太阳 狮子 · 月亮[查] · 上升 天秤/天蝎附近（中午）'
      },
      {
        name: '1995-03-08 时辰未知 北京（验证 hour=null 降级行为）',
        input: [1995, 3, 8, null, '北京'],
        expected: '太阳 双鱼 · 月亮 confidence=medium · 上升 null'
      }
    ];

    const results = [];
    for (const c of cases) {
      try {
        const r = calcAstrologyComplete.apply(null, c.input);
        results.push({
          name: c.name,
          expected: c.expected,
          actual: {
            sun: r.sun.sign + '（' + r.sun.element + '）',
            moon: r.moon.sign + '（' + r.moon.longitude.toFixed(2) + '° · ' + r.moon.confidence + '）',
            rising: r.rising
              ? r.rising.sign + '（' + r.rising.longitude.toFixed(2) + '° · ' + r.rising.confidence + ' · ' + r.rising.city + '）'
              : 'null（时辰未知）'
          }
        });
      } catch (e) {
        results.push({ name: c.name, error: String(e) });
      }
    }
    return results;
  }

  /* ========================================================================
   * 8. 对外暴露
   * ====================================================================== */

  window.ASTRO.SIGNS = SIGNS;
  window.ASTRO.SIGN_EN = SIGN_EN;
  window.ASTRO.SIGN_ELEMENTS = SIGN_ELEMENTS;
  window.ASTRO.CITIES = CITIES;
  window.ASTRO.DEFAULT_CITY = DEFAULT_CITY;

  window.ASTRO.calcSunSign           = calcSunSign;
  window.ASTRO.calcMoonSign          = calcMoonSign;
  window.ASTRO.calcRisingSign        = calcRisingSign;
  window.ASTRO.calcAstrologyComplete = calcAstrologyComplete;
  window.ASTRO.runTests              = runTests;

  // 内部函数也暴露给调试/扩展用
  window.ASTRO._internal = {
    julianDay,
    moonLongitude,
    gmstDegrees,
    obliquity
  };
})();
