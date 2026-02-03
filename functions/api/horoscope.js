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
    // 1. Fetch raw data
    const res = await fetch('https://www.asahi.co.jp/data/ohaasa2020/horoscope.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!res.ok) throw new Error(`External source failed: ${res.status}`);

    const rawData = await res.json();
    const item = Array.isArray(rawData) ? rawData[0] : rawData;
    const dateStr = item?.onair_date;
    if (!dateStr || !item.detail) throw new Error('Source data format invalid');

    // 2. Cache Check
    if (CACHE) {
      const cached = await CACHE.get(`horo_deepl_${dateStr}`);
      if (cached) {
        return new Response(cached, { headers: { ...headers, 'X-Cache': 'HIT' } });
      }
    }

    // 3. Parse and prepare texts for translation
    const parsed = item.detail
      .sort((a, b) => parseInt(a.ranking_no) - parseInt(b.ranking_no))
      .map(d => ({
        rank: parseInt(d.ranking_no, 10),
        zodiac: ZODIAC_MAP[d.horoscope_st] || { jp: '', ko: '', en: '' },
        ...parseHoroscopeText(d.horoscope_text),
      }));

    const contents = parsed.map(p => p.content);
    const luckies = parsed.map(p => p.lucky);

    // 4. Translate with DeepL (parallel requests for KO and EN)
    const [contentsKo, contentsEn, luckiesKo, luckiesEn] = await Promise.all([
      translateWithDeepL(contents, 'KO', API_KEY),
      translateWithDeepL(contents, 'EN', API_KEY),
      translateWithDeepL(luckies, 'KO', API_KEY),
      translateWithDeepL(luckies, 'EN', API_KEY),
    ]);

    // 5. Build final result
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

    // 6. Cache Save
    if (CACHE) {
      context.waitUntil(CACHE.put(`horo_deepl_${dateStr}`, finalStr, { expirationTtl: 86400 }).catch(() => {}));
    }

    return new Response(finalStr, { headers: { ...headers, 'X-Cache': 'MISS' } });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Backend Error',
      message: err.message,
      type: err.name
    }), { status: 500, headers });
  }
}
