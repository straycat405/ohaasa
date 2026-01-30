const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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

// rank → horoscope_st 매핑으로 zodiac 덮어쓰기
function applyZodiacMapping(horoscopeData, rawDetail) {
  // rank → horoscope_st 매핑 생성
  const rankToCode = {};
  rawDetail.forEach(d => {
    rankToCode[parseInt(d.ranking_no, 10)] = d.horoscope_st;
  });

  // zodiac 덮어쓰기
  horoscopeData.horoscope.forEach(h => {
    const code = rankToCode[h.rank];
    if (code && ZODIAC_MAP[code]) {
      h.zodiac = ZODIAC_MAP[code];
    }
  });

  return horoscopeData;
}

export async function onRequest(context) {
  const { env } = context;
  const CACHE = env.CACHE;
  const API_KEY = env.GEMINI_API_KEY;

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

    // 2. Cache Check (v7)
    if (CACHE) {
      const cached = await CACHE.get(`horo_v7_${dateStr}`);
      if (cached) {
        // 캐시된 데이터에 zodiac 매핑 적용
        const cachedObj = JSON.parse(cached);
        const corrected = applyZodiacMapping(cachedObj, item.detail);
        return new Response(JSON.stringify(corrected), { headers: { ...headers, 'X-Cache': 'HIT' } });
      }
    }

    // 3. Gemini Prompt
    const content = item.detail.map(d => `Rank: ${d.ranking_no}, Sign: ${d.horoscope_st}, Text: ${d.horoscope_text}`).join('\n');
    const prompt = `
Return horoscope data for ${dateStr} as JSON.
Provide translations in Korean, English, AND keep the original Japanese.

Requirements:
- zodiac: { jp, ko, en }
- content: { jp, ko, en }
- lucky: { jp, ko, en } (Extract lucky item/action from the end of the text)

Format:
{"date": "${dateStr}", "horoscope": [{"rank": 1, "zodiac": {...}, "content": {...}, "lucky": {...}}, ...]}

Source:
${content}

Return ONLY valid JSON.
`;

    // 4. Gemini Request (Simplified body for maximum compatibility)
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiJson = await geminiRes.json();
    if (geminiJson.error) throw new Error(`Gemini: ${geminiJson.error.message}`);

    const rawText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini returned no text content');

    // Clean and Validate (Robust regex-based cleaning)
    const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();
    const finalObj = JSON.parse(cleanJson);

    // zodiac 매핑 적용
    const correctedObj = applyZodiacMapping(finalObj, item.detail);
    const finalStr = JSON.stringify(correctedObj);

    // 5. Cache Save
    if (CACHE) {
      context.waitUntil(CACHE.put(`horo_v7_${dateStr}`, finalStr, { expirationTtl: 86400 }).catch(() => {}));
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
