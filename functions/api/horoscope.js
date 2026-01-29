// 별자리 코드 -> 이름 매핑
const zodiacMap = {
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

export async function onRequest(context) {
  try {
    const response = await fetch('https://www.asahi.co.jp/data/ohaasa2020/horoscope.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });

    const jsonData = await response.json();

    // JSON 배열의 첫 번째 항목 사용
    const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;

    // 날짜 포맷팅 (20260129 -> 1月29日)
    const dateStr = data.onair_date;
    const month = parseInt(dateStr.substring(4, 6));
    const day = parseInt(dateStr.substring(6, 8));
    const dateText = `${month}月${day}日の運勢`;

    // 운세 데이터 변환
    const horoscopeData = data.detail.map(item => {
      const zodiac = zodiacMap[item.horoscope_st];
      return {
        rank: item.ranking_no,
        jpName: zodiac?.jp || '',
        ko: zodiac?.ko || '',
        en: zodiac?.en || '',
        content: item.horoscope_text
      };
    });

    // 순위순 정렬
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
