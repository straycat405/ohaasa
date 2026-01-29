const zodiacMap = {
  'おひつじ座': { ko: '양자리', en: 'Aries' },
  'おうし座': { ko: '황소자리', en: 'Taurus' },
  'ふたご座': { ko: '쌍둥이자리', en: 'Gemini' },
  'かに座': { ko: '게자리', en: 'Cancer' },
  'しし座': { ko: '사자자리', en: 'Leo' },
  'おとめ座': { ko: '처녀자리', en: 'Virgo' },
  'てんびん座': { ko: '천칭자리', en: 'Libra' },
  'さそり座': { ko: '전갈자리', en: 'Scorpio' },
  'いて座': { ko: '사수자리', en: 'Sagittarius' },
  'やぎ座': { ko: '염소자리', en: 'Capricorn' },
  'みずがめ座': { ko: '물병자리', en: 'Aquarius' },
  'うお座': { ko: '물고기자리', en: 'Pisces' },
};

export async function onRequest(context) {
  try {
    const response = await fetch('https://www.asahi.co.jp/ohaasa/week/horoscope/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const horoscopeData = [];

    // Extract Date
    let dateText = new Date().toLocaleDateString();
    const dateMatch = html.match(/(\d+月\d+日（.）の運勢)/);
    if (dateMatch && dateMatch[1]) {
      dateText = dateMatch[1];
    }

    // Extract horoscope data using regex
    const horoscopeRegex = /(\d+)\s+([^\s]+)\s+([\s\S]+?)(?=(\d+)\s+([^\s]+)|\s*$)/g;
    let match;
    while ((match = horoscopeRegex.exec(html)) !== null) {
      const rank = match[1];
      const jpName = match[2];
      const content = match[3].trim();

      if (zodiacMap[jpName]) {
        horoscopeData.push({
          rank,
          jpName,
          ...zodiacMap[jpName],
          content
        });
      }
    }

    return new Response(JSON.stringify({
      date: dateText,
      horoscope: horoscopeData.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
