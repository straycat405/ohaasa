import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Sparkles, Crown, Clover, Moon, Sun } from 'lucide-react';
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

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorDesc, setErrorDesc] = useState<string | null>(null);

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
      const m = parseInt(clean.substring(4, 6));
      const d = parseInt(clean.substring(6, 8));
      return i18n.language === 'ja' ? `${m}月${d}日` : `${m}/${d}`;
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
                           <div className="p-2 rounded-xl shrink-0" style={{ background: 'var(--bg-accent)' }}>
                            <ZodiacIcon sign={getSignKey(item)} className="w-12 h-12" style={{ color: 'var(--text-primary)' }} />
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
