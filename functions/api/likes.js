// 별자리 좋아요 API 엔드포인트
// GET /api/likes - 모든 별자리의 좋아요 수 조회
// POST /api/likes - 특정 별자리에 좋아요 추가

const VALID_ZODIAC_CODES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

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

  try {
    if (request.method === 'GET') {
      // 모든 별자리의 좋아요 수 조회
      const likes = {};

      await Promise.all(
        VALID_ZODIAC_CODES.map(async (code) => {
          const key = `likes_zodiac_${code}`;
          const data = await CACHE.get(key);
          if (data) {
            const parsed = JSON.parse(data);
            likes[code] = parsed.count || 0;
          } else {
            likes[code] = 0;
          }
        })
      );

      return new Response(JSON.stringify({ likes }), { headers });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const { zodiacCode, clientId } = body;

      // 유효성 검사
      if (!zodiacCode || !VALID_ZODIAC_CODES.includes(zodiacCode)) {
        return new Response(JSON.stringify({ error: 'Invalid zodiac code' }), { status: 400, headers });
      }

      if (!clientId || typeof clientId !== 'string' || clientId.length < 10) {
        return new Response(JSON.stringify({ error: 'Invalid client ID' }), { status: 400, headers });
      }

      // 중복 방지 확인 (24시간 TTL)
      const rateLimitKey = `like_rate_${clientId}_${zodiacCode}`;
      const existingRate = await CACHE.get(rateLimitKey);

      if (existingRate) {
        return new Response(JSON.stringify({ error: 'Already liked', code: 'ALREADY_LIKED' }), { status: 429, headers });
      }

      // 좋아요 수 증가
      const likesKey = `likes_zodiac_${zodiacCode}`;
      const currentData = await CACHE.get(likesKey);
      let currentCount = 0;

      if (currentData) {
        const parsed = JSON.parse(currentData);
        currentCount = parsed.count || 0;
      }

      const newCount = currentCount + 1;

      // 좋아요 수 저장 (영구 저장)
      await CACHE.put(likesKey, JSON.stringify({ count: newCount }));

      // 중복 방지 키 저장 (1시간 TTL)
      await CACHE.put(rateLimitKey, JSON.stringify({ timestamp: Date.now() }), { expirationTtl: 3600 });

      return new Response(JSON.stringify({ success: true, count: newCount }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Server Error',
      message: err.message
    }), { status: 500, headers });
  }
}
