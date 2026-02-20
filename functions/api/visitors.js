// 방문자 카운터 API 엔드포인트
// GET /api/visitors - total, today, yesterday 조회
// POST /api/visitors - 방문 기록

function getTodayString() {
  const now = new Date();
  const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, '0');
  const day = String(japanTime.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function getYesterdayString() {
  const now = new Date();
  const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  japanTime.setDate(japanTime.getDate() - 1);
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, '0');
  const day = String(japanTime.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export async function onRequest(context) {
  const { request, env } = context;
  const CACHE = env.CACHE;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (!CACHE) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), { status: 500, headers });
  }

  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();

  try {
    if (request.method === 'GET') {
      // 방문자 수 조회
      const [totalData, todayData, yesterdayData] = await Promise.all([
        CACHE.get('visitor_total'),
        CACHE.get(`visitor_${todayStr}`),
        CACHE.get(`visitor_${yesterdayStr}`),
      ]);

      const total = totalData ? JSON.parse(totalData).count : 0;
      const today = todayData ? JSON.parse(todayData).count : 0;
      const yesterday = yesterdayData ? JSON.parse(yesterdayData).count : 0;

      return new Response(JSON.stringify({ total, today, yesterday, date: todayStr }), { headers });
    }

    if (request.method === 'POST') {
      // 방문 기록
      const [totalData, todayData] = await Promise.all([
        CACHE.get('visitor_total'),
        CACHE.get(`visitor_${todayStr}`),
      ]);

      const currentTotal = totalData ? JSON.parse(totalData).count : 0;
      const currentToday = todayData ? JSON.parse(todayData).count : 0;

      // 카운터 증가
      await Promise.all([
        CACHE.put('visitor_total', JSON.stringify({ count: currentTotal + 1 })),
        CACHE.put(`visitor_${todayStr}`, JSON.stringify({ count: currentToday + 1 }), { expirationTtl: 604800 }), // 7일 TTL
      ]);

      return new Response(JSON.stringify({
        success: true,
        total: currentTotal + 1,
        today: currentToday + 1
      }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Server Error',
      message: err.message
    }), { status: 500, headers });
  }
}
