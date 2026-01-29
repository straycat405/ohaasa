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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
      }
    });

    const html = await response.text();
    const horoscopeData = [];

    // Extract date (e.g., "1月29日(木)の運勢")
    let dateText = new Date().toLocaleDateString('ja-JP');
    const dateMatch = html.match(/(\d+月\d+日.{1,5}の運勢)/);
    if (dateMatch) {
      dateText = dateMatch[1];
    }

    // Parse horoscope items using regex on the HTML structure
    // Pattern: <li class="rank{N} {sign}">...<span class="horo_rank">{rank}</span>...<span class="horo_name...">{name}</span>...<dd class="horo_txt">{content}</dd>
    const itemRegex = /<li\s+class="rank(\d+)\s+\w+"[\s\S]*?<span\s+class="horo_rank"[^>]*>[\s\S]*?(\d+)[\s\S]*?<\/span>[\s\S]*?<span\s+class="horo_name[^"]*"[^>]*>(.*?)<\/span>[\s\S]*?<dd\s+class="horo_txt"[^>]*>([\s\S]*?)<\/dd>/gi;

    let match;
    while ((match = itemRegex.exec(html)) !== null) {
      const rank = match[2].trim();
      const jpName = match[3].trim();
      const content = match[4].trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (zodiacMap[jpName]) {
        horoscopeData.push({
          rank,
          jpName,
          ...zodiacMap[jpName],
          content
        });
      }
    }

    // Sort by rank
    horoscopeData.sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

    return new Response(JSON.stringify({
      date: dateText,
      horoscope: horoscopeData
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch data',
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
