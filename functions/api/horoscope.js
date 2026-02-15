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

// TV Asahi HTML에서 순위 정보 파싱
function parseRanking(html) {
  const ranking = {};

  // rank-box 내의 li 요소들에서 data-label 추출
  const rankBoxRegex = /<ul[^>]*class="[^"]*rank-box[^"]*"[^>]*>([\s\S]*?)<\/ul>/i;
  const rankBoxMatch = html.match(rankBoxRegex);

  if (rankBoxMatch) {
    const rankBox = rankBoxMatch[1];
    // 각 li 내의 a 태그에서 data-label 추출
    const liRegex = /<li[^>]*>[\s\S]*?<a[^>]*data-label="([^"]+)"[^>]*>[\s\S]*?<\/li>/gi;
    let match;
    let rank = 1;
    while ((match = liRegex.exec(rankBox)) !== null) {
      const zodiacId = match[1];
      ranking[zodiacId] = rank++;
    }
  }

  return ranking;
}

// TV Asahi HTML에서 운세 데이터 파싱
function parseTVAsahiHTML(html) {
  const results = [];
  const zodiacIds = Object.keys(TVASAHI_ZODIAC_MAP);

  // 먼저 순위 정보 파싱
  const ranking = parseRanking(html);

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

    // 순위 가져오기 (순위 박스에서 파싱한 값 사용, 없으면 코드 순서)
    const rank = ranking[zodiacId] || parseInt(code);

    // lucky 문자열 조합
    const lucky = `ラッキーカラー：${luckyColor} / 幸運のカギ：${luckyKey}`;

    results.push({
      rank,
      zodiac,
      content,
      lucky
    });
  }

  // 순위로 정렬
  results.sort((a, b) => a.rank - b.rank);

  return results.map(item => ({
    rank: item.rank,
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
    const todayStr = getTodayDateString();
    const todayCompact = todayStr.replace(/\//g, ''); // YYYYMMDD 형식
    let dateStr, parsed;
    let source = 'ohaasa';

    // 먼저 캐시 확인 (오늘 날짜 기준)
    if (CACHE) {
      // ohaasa 캐시 확인
      const cachedOhaasa = await CACHE.get(`horo_deepl_${todayCompact}`);
      if (cachedOhaasa) {
        return new Response(cachedOhaasa, { headers: { ...headers, 'X-Cache': 'HIT', 'X-Source': 'ohaasa' } });
      }
      // TV Asahi 캐시 확인
      const cachedTVAsahi = await CACHE.get(`horo_weekend_v2_${todayStr}`);
      if (cachedTVAsahi) {
        return new Response(cachedTVAsahi, { headers: { ...headers, 'X-Cache': 'HIT', 'X-Source': 'tv-asahi' } });
      }
    }

    // 평일: 먼저 asahi.co.jp API 시도
    const isWeekend = isWeekendInJapan();
    let useOhaasa = false;

    if (!isWeekend) {
      try {
        const res = await fetch('https://www.asahi.co.jp/data/ohaasa2020/horoscope.json', {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (res.ok) {
          const rawData = await res.json();
          const item = Array.isArray(rawData) ? rawData[0] : rawData;
          const apiDate = item?.onair_date;

          // API 날짜가 오늘과 일치하는지 확인
          if (apiDate === todayCompact && item.detail) {
            dateStr = apiDate;
            parsed = item.detail
              .sort((a, b) => parseInt(a.ranking_no) - parseInt(b.ranking_no))
              .map(d => ({
                rank: parseInt(d.ranking_no, 10),
                zodiac: ZODIAC_MAP[d.horoscope_st] || { jp: '', ko: '', en: '' },
                ...parseHoroscopeText(d.horoscope_text),
              }));
            useOhaasa = true;
          }
        }
      } catch (e) {
        // ohaasa API 실패 시 TV Asahi로 fallback
        console.log('Ohaasa API failed, falling back to TV Asahi:', e.message);
      }
    }

    // ohaasa가 오래된 데이터거나 주말인 경우 TV Asahi 사용
    if (!useOhaasa) {
      dateStr = todayStr;
      parsed = await fetchWeekendHoroscope();
      source = 'tv-asahi';
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

    // Cache Save (7 days TTL for historical data access)
    if (CACHE) {
      const cacheKey = source === 'tv-asahi' ? `horo_weekend_v2_${dateStr}` : `horo_deepl_${dateStr}`;
      context.waitUntil(CACHE.put(cacheKey, finalStr, { expirationTtl: 604800 }).catch(() => {}));
    }

    return new Response(finalStr, {
      headers: {
        ...headers,
        'X-Cache': 'MISS',
        'X-Source': source
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
