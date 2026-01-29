const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function onRequest(context) {
  const { env } = context;
  const CACHE = env.CACHE;
  const API_KEY = env.GEMINI_API_KEY;

  try {
    // 1. Fetch raw data from Asahi TV
    const response = await fetch('https://www.asahi.co.jp/data/ohaasa2020/horoscope.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });

    const jsonData = await response.json();
    const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;
    const dateStr = data.onair_date; // e.g. "20260130"

    // 2. Check KV Cache
    if (CACHE) {
      const cachedData = await CACHE.get(`horoscope_${dateStr}`);
      if (cachedData) {
        console.log('Cache hit for date:', dateStr);
        return new Response(cachedData, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'HIT'
          }
        });
      }
    }

    // 3. Prepare data for Gemini
    // We only need the relevant parts to keep the prompt small
    const rawHoroscopeText = data.detail.map(item => {
      return `Rank: ${item.ranking_no}\nZodiac: ${item.horoscope_st}\nText: ${item.horoscope_text}`;
    }).join('\n\n');

    const prompt = `
You are a professional astrologer and translator.
I will provide you with Japanese horoscope data from Asahi TV.
Please translate it into Korean and English, and return it strictly in JSON format.

Input Data:
${rawHoroscopeText}

Requirements:
1. Return a JSON object with a "date" field and a "horoscope" array.
2. The "date" field should be the on-air date (e.g., "${dateStr}").
3. Each item in the "horoscope" array must have:
   - "rank": (number) The ranking.
   - "zodiac": (object) { "jp": "Japanese Name", "ko": "Korean Name", "en": "English Name" }
   - "content": (object) { "ko": "Korean Translation of fortune", "en": "English Translation of fortune" }
   - "lucky": (object) { "ko": "Korean Translation of lucky item/action", "en": "English Translation of lucky item/action" }

Note: The Japanese text often contains the lucky item/action at the end (e.g., "とんかつを食べる", "グレー의服を着る"). Please separate this into the "lucky" field.

Return only valid JSON.
`;

    // 4. Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const geminiResult = await geminiResponse.json();
    const translatedJson = geminiResult.candidates[0].content.parts[0].text;

    // 5. Save to KV Cache
    if (CACHE) {
      await CACHE.put(`horoscope_${dateStr}`, translatedJson, { expirationTtl: 86400 }); // 24 hours
    }

    return new Response(translatedJson, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to process horoscope',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
