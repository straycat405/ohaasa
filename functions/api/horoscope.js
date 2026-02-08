const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// 별자리 코드 → 3개 언어 매핑 (상수)
const ZODIAC_MAP = {
  '01': { jp: 'おひつじ座', ko: '양자리', en: 'Aries' },
  '02': { jp: 'おうし座', ko: '황소자리', en: 'Taurus' },
  '03': { jp: 'ふたご座', ko: '쌍둥이자리', en: 'Gemini' },
  '04': { jp: 'かに座', ko: '게자리', en: 'Cancer' },
  '05': { jp: 'しし座', ko: '사자자리', en: 'Leo' },
  '06': { jp: 'おとめ座', ko: '처녀자리', en: 'Virgo' },
  '07': { jp: 'てんびん座', ko: '천칭자리', en: 'Libra' },
  '08': { jp: 'さそり座', ko: '전갈자리', en: 'Scorpio' },
  '09': { jp: 'いて座', ko: '사수자리', en: 'Sagittarius' },
  '10': { jp: 'やぎ座', ko: '염소자리', en: 'Capricorn' },
  '11': { jp: 'みずがめ座', ko: '물병자리', en: 'Aquarius' },
  '12': { jp: 'うお座', ko: '물고기자리', en: 'Pisces' },
};

// TV Asahi 사이트용 별자리 ID → 코드 매핑
const TVASAHI_ZODIAC_MAP = {
  'ohitsuji': '01',
  'ousi': '02',
  'futago': '03',
  'kani': '04',
  'sisi': '05',
  'otome': '06',
  'tenbin': '07',
  'sasori': '08',
  'ite': '09',
  'yagi': '10',
  'mizugame': '11',
  'uo': '12',
};

// 일본 시간 기준 주말 여부 확인
function isWeekendInJapan() {
  const now = new Date();
  const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const day = japanTime.getDay();
  return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)
}

// 일본 시간 기준 오늘 날짜 문자열
function getTodayDateString() {
  const now = new Date();
  const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, '0');
  const day = String(japanTime.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// TV Asahi HTML에서 운세 데이터 파싱
function parseTVAsahiHTML(html) {
  const results = [];
  const zodiacIds = Object.keys(TVASAHI_ZODIAC_MAP);

  for (const zodiacId of zodiacIds) {
    const code = TVASAHI_ZODIAC_MAP[zodiacId];
    const zodiac = ZODIAC_MAP[code];

    // 해당 별자리 섹션 추출
    const sectionRegex = new RegExp(
      `<div[^>]*class="seiza-box"[^>]*id="${zodiacId}"[^>]*>([\\s\\S]*?)(?=<div[^>]*class="seiza-box"|<\\/div>\\s*<\\/div>\\s*<!--\\s*seiza-area)`,
      'i'
    );
    const sectionMatch = html.match(sectionRegex);

    if (!sectionMatch) continue;
    const section = sectionMatch[1];

    // 운세 텍스트 추출 (read-area 내의 <p> 태그)
    const readAreaRegex = /<div[^>]*class="read-area"[^>]*>([\s\S]*?)<\/div>/i;
    const readMatch = section.match(readAreaRegex);
    let content = '';
    if (readMatch) {
      // <p> 태그 내용 추출, HTML 태그 제거
      const pRegex = /<p[^>]*class="read"[^>]*>([\s\S]*?)<\/p>/i;
      const pMatch = readMatch[1].match(pRegex);
      if (pMatch) {
        content = pMatch[1].replace(/<[^>]+>/g, '').trim();
      }
    }

    // 럭키 컬러 추출 (span 태그 뒤의 값)
    const luckyColorRegex = /<span[^>]*class="[^"]*lucky-color-txt[^"]*"[^>]*>[^<]*<\/span>：([^<]+)/i;
    const colorMatch = section.match(luckyColorRegex);
    const luckyColor = colorMatch ? colorMatch[1].trim() : '';

    // 행운의 카기 추출 (span 태그 뒤의 값)
    const keyRegex = /<span[^>]*class="[^"]*key-txt[^"]*"[^>]*>[^<]*<\/span>：([^<]+)/i;
    const keyMatch = section.match(keyRegex);
    const luckyKey = keyMatch ? keyMatch[1].trim() : '';

    // 1위 여부 확인 (number-one-box 존재 여부)
    const isNumberOne = section.includes('number-one-box');

    // lucky 문자열 조합
    const lucky = `ラッキーカラー：${luckyColor} / 幸運のカギ：${luckyKey}`;

    results.push({
      code,
      zodiac,
      content,
      lucky,
      isNumberOne
    });
  }

  // 1위를 먼저, 나머지는 코드 순서대로 (랭킹 정보가 없으므로 임의 순서)
  results.sort((a, b) => {
    if (a.isNumberOne && !b.isNumberOne) return -1;
    if (!a.isNumberOne && b.isNumberOne) return 1;
    return parseInt(a.code) - parseInt(b.code);
  });

  // rank 부여
  return results.map((item, index) => ({
    rank: index + 1,
    zodiac: item.zodiac,
    content: item.content,
    lucky: item.lucky
  }));
}

// TV Asahi에서 주말 운세 가져오기
async function fetchWeekendHoroscope() {
  const res = await fetch('https://www.tv-asahi.co.jp/goodmorning/uranai/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });

  if (!res.ok) throw new Error(`TV Asahi fetch failed: ${res.status}`);

  const html = await res.text();
  const parsed = parseTVAsahiHTML(html);

  if (parsed.length === 0) throw new Error('Failed to parse TV Asahi horoscope data');

  return parsed;
}

// 일본어 텍스트에서 content와 lucky 분리
function parseHoroscopeText(text) {
  // 탭으로 분리, 빈 문자열 제거
  const parts = text.split('\t').filter(p => p.trim());
  if (parts.length === 0) return { content: '', lucky: '' };

  // 마지막이 lucky, 나머지가 content
  const lucky = parts[parts.length - 1];
  const content = parts.slice(0, -1).join(' ');

  return { content, lucky };
}

// DeepL API로 번역
async function translateWithDeepL(texts, targetLang, apiKey) {
  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      source_lang: 'JA',
      target_lang: targetLang,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(`DeepL: ${data.error.message || data.message}`);

  return data.translations.map(t => t.text);
}

export async function onRequest(context) {
  const { env } = context;
  const CACHE = env.CACHE;
  const API_KEY = env.DEEPL_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  try {
    const isWeekend = isWeekendInJapan();
    let dateStr, parsed;

    if (isWeekend) {
      // 주말: TV Asahi 사이트에서 데이터 가져오기
      dateStr = getTodayDateString();

      // Cache Check
      if (CACHE) {
        const cached = await CACHE.get(`horo_weekend_${dateStr}`);
        if (cached) {
          return new Response(cached, { headers: { ...headers, 'X-Cache': 'HIT', 'X-Source': 'tv-asahi' } });
        }
      }

      parsed = await fetchWeekendHoroscope();
    } else {
      // 평일: 기존 asahi.co.jp API 사용
      const res = await fetch('https://www.asahi.co.jp/data/ohaasa2020/horoscope.json', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (!res.ok) throw new Error(`External source failed: ${res.status}`);

      const rawData = await res.json();
      const item = Array.isArray(rawData) ? rawData[0] : rawData;
      dateStr = item?.onair_date;
      if (!dateStr || !item.detail) throw new Error('Source data format invalid');

      // Cache Check
      if (CACHE) {
        const cached = await CACHE.get(`horo_deepl_${dateStr}`);
        if (cached) {
          return new Response(cached, { headers: { ...headers, 'X-Cache': 'HIT', 'X-Source': 'ohaasa' } });
        }
      }

      parsed = item.detail
        .sort((a, b) => parseInt(a.ranking_no) - parseInt(b.ranking_no))
        .map(d => ({
          rank: parseInt(d.ranking_no, 10),
          zodiac: ZODIAC_MAP[d.horoscope_st] || { jp: '', ko: '', en: '' },
          ...parseHoroscopeText(d.horoscope_text),
        }));
    }

    const contents = parsed.map(p => p.content);
    const luckies = parsed.map(p => p.lucky);

    // Translate with DeepL (parallel requests for KO and EN)
    const [contentsKo, contentsEn, luckiesKo, luckiesEn] = await Promise.all([
      translateWithDeepL(contents, 'KO', API_KEY),
      translateWithDeepL(contents, 'EN', API_KEY),
      translateWithDeepL(luckies, 'KO', API_KEY),
      translateWithDeepL(luckies, 'EN', API_KEY),
    ]);

    // Build final result
    const horoscope = parsed.map((p, i) => ({
      rank: p.rank,
      zodiac: p.zodiac,
      content: {
        jp: p.content,
        ko: contentsKo[i],
        en: contentsEn[i],
      },
      lucky: {
        jp: p.lucky,
        ko: luckiesKo[i],
        en: luckiesEn[i],
      },
    }));

    const finalObj = { date: dateStr, horoscope };
    const finalStr = JSON.stringify(finalObj);

    // Cache Save
    if (CACHE) {
      const cacheKey = isWeekend ? `horo_weekend_${dateStr}` : `horo_deepl_${dateStr}`;
      context.waitUntil(CACHE.put(cacheKey, finalStr, { expirationTtl: 86400 }).catch(() => {}));
    }

    return new Response(finalStr, {
      headers: {
        ...headers,
        'X-Cache': 'MISS',
        'X-Source': isWeekend ? 'tv-asahi' : 'ohaasa'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Backend Error',
      message: err.message,
      type: err.name
    }), { status: 500, headers });
  }
}
