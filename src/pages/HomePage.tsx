import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Sparkles, Crown, Clover, Moon, Sun, Heart } from 'lucide-react';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';
import { ZodiacIcon } from '../components/ZodiacIcon';

interface LanguageContent {
  jp: string;
  ko: string;
  en: string;
}

interface Horoscope {
  rank: number;
  zodiac: LanguageContent;
  content: LanguageContent;
  lucky: LanguageContent;
}

interface HoroscopeData {
  date: string;
  horoscope: Horoscope[];
}

// 클라이언트 고유 ID 관리
function getClientId(): string {
  const storageKey = 'horoscope_client_id';
  let clientId = localStorage.getItem(storageKey);
  if (!clientId) {
    clientId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, clientId);
  }
  return clientId;
}

// 좋아요한 별자리 추적 (1시간 후 다시 좋아요 가능)
const LIKE_COOLDOWN_MS = 60 * 60 * 1000; // 1시간

function getLikedSigns(): Set<string> {
  const stored = localStorage.getItem('liked_signs_v2');
  if (stored) {
    const data: Record<string, number> = JSON.parse(stored);
    const now = Date.now();
    const activeLikes = new Set<string>();
    for (const [code, timestamp] of Object.entries(data)) {
      if (now - timestamp < LIKE_COOLDOWN_MS) {
        activeLikes.add(code);
      }
    }
    return activeLikes;
  }
  return new Set();
}

function saveLikedSign(zodiacCode: string): void {
  const stored = localStorage.getItem('liked_signs_v2');
  const data: Record<string, number> = stored ? JSON.parse(stored) : {};
  data[zodiacCode] = Date.now();
  localStorage.setItem('liked_signs_v2', JSON.stringify(data));
}

// 영문 별자리명 → 코드 변환
const ZODIAC_TO_CODE: Record<string, string> = {
  'Aries': '01',
  'Taurus': '02',
  'Gemini': '03',
  'Cancer': '04',
  'Leo': '05',
  'Virgo': '06',
  'Libra': '07',
  'Scorpio': '08',
  'Sagittarius': '09',
  'Capricorn': '10',
  'Aquarius': '11',
  'Pisces': '12',
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorDesc, setErrorDesc] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedSigns, setLikedSigns] = useState<Set<string>>(new Set());
  const [likingInProgress, setLikingInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('--- Fetching Horoscope Data ---');
      try {
        const apiUrl = '/api/horoscope';
        console.log(`URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log(`Status: ${response.status} ${response.statusText}`);

        const body = await response.text();
        console.log(`Raw Body length: ${body.length}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${body.substring(0, 100)}`);
        }

        const jsonData = JSON.parse(body);
        console.log('Parsed JSON Success:', Object.keys(jsonData));

        if (!jsonData.horoscope) {
          throw new Error('JSON missing "horoscope" array');
        }

        setData(jsonData);
      } catch (err: any) {
        console.error('CRITICAL FETCH ERROR:', err);
        setErrorDesc(err.message);
      } finally {
        setLoading(false);
        console.log('--- Fetch Process Finished ---');
      }
    };
    fetchData();
  }, []);

  // 좋아요 데이터 로드
  useEffect(() => {
    // localStorage에서 좋아요 상태 로드
    setLikedSigns(getLikedSigns());

    // 서버에서 좋아요 수 가져오기
    const fetchLikes = async () => {
      try {
        const response = await fetch('/api/likes');
        if (response.ok) {
          const data = await response.json();
          setLikes(data.likes || {});
        }
      } catch (err) {
        console.error('Failed to fetch likes:', err);
      }
    };
    fetchLikes();
  }, []);

  // 좋아요 처리 함수
  const handleLike = async (zodiacEnName: string) => {
    const zodiacCode = ZODIAC_TO_CODE[zodiacEnName];
    if (!zodiacCode || likedSigns.has(zodiacCode) || likingInProgress) return;

    setLikingInProgress(zodiacCode);

    try {
      const clientId = getClientId();
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zodiacCode, clientId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 성공: 상태 업데이트
        setLikes(prev => ({ ...prev, [zodiacCode]: result.count }));
        setLikedSigns(prev => new Set([...prev, zodiacCode]));
        saveLikedSign(zodiacCode);
      } else if (result.code === 'ALREADY_LIKED') {
        // 이미 좋아요한 경우: localStorage 동기화
        setLikedSigns(prev => new Set([...prev, zodiacCode]));
        saveLikedSign(zodiacCode);
      }
    } catch (err) {
      console.error('Failed to like:', err);
    } finally {
      setLikingInProgress(null);
    }
  };

  // 별자리 코드 가져오기
  const getZodiacCode = (item: Horoscope): string => {
    const enName = item.zodiac?.en || '';
    return ZODIAC_TO_CODE[enName] || '';
  };

  const sortedHoroscope = useMemo(() => {
    if (!data?.horoscope) return [];
    return [...data.horoscope].sort((a, b) => a.rank - b.rank);
  }, [data]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getLangKey = () => {
    const lang = i18n.language;
    if (lang === 'ja') return 'jp';
    if (lang === 'en') return 'en';
    return 'ko';
  };

  const getSignName = (item: Horoscope) => item.zodiac?.[getLangKey()] || '';
  const getContent = (item: Horoscope) => item.content?.[getLangKey()] || '';
  const getLucky = (item: Horoscope) => item.lucky?.[getLangKey()] || '';
  const getSignKey = (item: Horoscope) => item.zodiac?.en || '';

  const zodiacDateRanges: Record<string, string> = {
    '염소자리': '12/22 ~ 1/19',
    '물병자리': '1/20 ~ 2/18',
    '물고기자리': '2/19 ~ 3/20',
    '양자리': '3/21 ~ 4/19',
    '황소자리': '4/20 ~ 5/20',
    '쌍둥이자리': '5/21 ~ 6/21',
    '게자리': '6/22 ~ 7/22',
    '사자자리': '7/23 ~ 8/22',
    '처녀자리': '8/23 ~ 9/23',
    '천칭자리': '9/24 ~ 10/22',
    '전갈자리': '10/23 ~ 11/22',
    '사수자리': '11/23 ~ 12/21',
  };

  const getDateRange = (item: Horoscope) => {
    const koName = item.zodiac?.ko || '';
    return zodiacDateRanges[koName] || '';
  };

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const clean = String(dateStr).replace(/[^0-9]/g, '');
    if (clean.length === 8) {
      const y = parseInt(clean.substring(0, 4));
      const m = parseInt(clean.substring(4, 6));
      const d = parseInt(clean.substring(6, 8));
      const date = new Date(y, m - 1, d);
      const dayIndex = date.getDay();

      const dayNames = {
        ko: ['일', '월', '화', '수', '목', '금', '토'],
        ja: ['日', '月', '火', '水', '木', '金', '土'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      };

      const lang = i18n.language === 'ja' ? 'ja' : i18n.language === 'en' ? 'en' : 'ko';
      const dayName = dayNames[lang][dayIndex];

      if (lang === 'ja') {
        return `${m}月${d}日(${dayName})`;
      }
      return `${m}/${d} (${dayName})`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-bg)' }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 animate-pulse shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-lg font-medium animate-bounce" style={{ color: 'var(--accent-gold)' }}>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (errorDesc || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-bg)' }}>
        <div className="text-center p-8 rounded-3xl shadow-xl max-w-sm w-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-accent)' }}>
            <Star className="w-10 h-10 animate-pulse" style={{ color: 'var(--accent-gold)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Error :(</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {errorDesc || 'Data not found.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={data?.date ? `${t('title')} ${formatDisplayDate(data.date)}` : t('title')}
        description={t('subtitle')}
        canonical="https://ohaasa.site/"
      />

      <div className="pb-12">
        <header
          className="backdrop-blur-md sticky top-0 z-10 theme-transition"
          style={{
            background: 'var(--header-bg)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
                  <Star className="w-6 h-6 star-twinkle" style={{ color: 'var(--accent-gold)' }} fill="currentColor" />
                  {t('title')}
                </h1>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
                  {formatDisplayDate(data.date)} | {t('subtitle')}
                  <br className="sm:hidden"/>
                  <span className="hidden sm:inline"> | </span>
                  <span className="text-xs opacity-75">{t('update_notice')}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* 테마 토글 버튼 */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl transition-all hover:scale-110"
                  style={{
                    background: 'var(--bg-accent)',
                    color: 'var(--accent-gold)'
                  }}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* 언어 선택 */}
                <div className="flex p-1.5 rounded-2xl shadow-inner" style={{ background: 'var(--bg-accent)' }}>
                  {['ko', 'ja', 'en'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        i18n.language === lang
                          ? 'shadow-sm scale-105'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        background: i18n.language === lang ? 'var(--bg-card)' : 'transparent',
                        color: i18n.language === lang ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}
                    >
                      {t(`lang_${lang}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10">
          <div className="grid gap-6">
            {sortedHoroscope.map((item, index) => (
              <div
                key={index}
                className={`group rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 theme-transition ${
                  item.rank === 1 ? 'ring-2 shadow-xl' : ''
                }`}
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${item.rank === 1 ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                  boxShadow: item.rank === 1 ? '0 0 30px rgba(251, 191, 36, 0.2)' : undefined
                }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={`rank-badge shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl text-lg font-black transition-transform group-hover:scale-110 ${
                      item.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/30' :
                      item.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                      item.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-amber-600 text-white' : ''
                    }`}
                    style={item.rank > 3 ? { background: 'var(--bg-accent)', color: 'var(--text-muted)' } : {}}
                    >
                      {item.rank === 1 ? <Crown className="w-6 h-6" /> : item.rank}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 p-1.5 rounded-xl shrink-0 flex items-center justify-center" style={{ background: 'var(--bg-accent)' }}>
                            <ZodiacIcon sign={getSignKey(item)} />
                           </div>
                           <div>
                            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                              {getSignName(item)}
                            </h2>
                            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                              {getDateRange(item)}
                            </span>
                           </div>
                        </div>
                        {item.rank === 1 && (
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-amber-400/30 animate-bounce">
                            <Sparkles className="w-3 h-3" />
                            NO.1
                          </span>
                        )}
                      </div>

                      <p className="leading-relaxed font-medium text-base sm:text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                        {getContent(item)}
                      </p>

                      <div
                        className="backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 group-hover:opacity-90 transition-colors"
                        style={{
                          background: 'var(--bg-lucky)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div className="p-2.5 rounded-xl shadow-sm" style={{ background: 'var(--bg-card)' }}>
                          <Clover className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                        </div>
                        <div className="text-sm">
                          <span className="font-black block mb-0.5 text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent-gold)' }}>
                            {i18n.language === 'en' ? 'Lucky Hint' : i18n.language === 'ja' ? 'ラッキー' : '행운의 비법'}
                          </span>
                          <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{getLucky(item)}</span>
                        </div>
                      </div>

                      {/* 좋아요 버튼 */}
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleLike(getSignKey(item))}
                          disabled={likedSigns.has(getZodiacCode(item)) || likingInProgress === getZodiacCode(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                            likedSigns.has(getZodiacCode(item))
                              ? 'cursor-default'
                              : 'hover:scale-105 active:scale-95'
                          }`}
                          style={{
                            background: likedSigns.has(getZodiacCode(item))
                              ? 'linear-gradient(135deg, #f43f5e, #ec4899)'
                              : 'var(--bg-accent)',
                            color: likedSigns.has(getZodiacCode(item))
                              ? 'white'
                              : 'var(--text-muted)',
                            opacity: likingInProgress === getZodiacCode(item) ? 0.7 : 1,
                          }}
                          aria-label={t('like_aria', { sign: getSignName(item) })}
                        >
                          <Heart
                            className={`w-4 h-4 ${likedSigns.has(getZodiacCode(item)) ? 'fill-current' : ''}`}
                          />
                          <span>{likes[getZodiacCode(item)] || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
