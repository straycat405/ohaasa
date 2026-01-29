const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

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

    // 2. Cache Check (v6)
    if (CACHE) {
      const cached = await CACHE.get(`horo_v6_${dateStr}`);
      if (cached) {
        return new Response(cached, { headers: { ...headers, 'X-Cache': 'HIT' } });
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
    const finalStr = JSON.stringify(finalObj);

    // 5. Cache Save
    if (CACHE) {
      context.waitUntil(CACHE.put(`horo_v6_${dateStr}`, finalStr, { expirationTtl: 86400 }).catch(() => {}));
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
