import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Sparkles, Crown, Clover } from 'lucide-react';
import SEO from '../components/SEO';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full mb-4 animate-pulse shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-emerald-600 animate-bounce">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (errorDesc || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-rose-100 max-w-sm w-full">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-rose-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error :(</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {errorDesc || 'Data not found.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 transition-all shadow-md active:scale-95"
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
        canonical="https://ohayoasa.pages.dev/"
      />

      <div className="pb-12">
        <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
                  <Star className="w-6 h-6 text-emerald-500 fill-emerald-200" />
                  {t('title')}
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">{formatDisplayDate(data.date)} | {t('subtitle')}</p>
              </div>

              <div className="flex bg-emerald-50 p-1.5 rounded-2xl shadow-inner">
                {['ko', 'ja', 'en'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      i18n.language === lang
                        ? 'bg-white shadow-sm text-emerald-600 scale-105'
                        : 'text-slate-400 hover:text-emerald-500'
                    }`}
                  >
                    {t(`lang_${lang}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10">
          <div className="grid gap-6">
            {sortedHoroscope.map((item, index) => (
              <div
                key={index}
                className={`group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
                  item.rank === 1 ? 'ring-2 ring-emerald-400/30 shadow-emerald-100 shadow-xl' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={`rank-badge shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl text-lg font-black transition-transform group-hover:scale-110 ${
                      item.rank === 1 ? 'bg-amber-100 text-amber-600' :
                      item.rank === 2 ? 'bg-slate-200 text-slate-700' :
                      item.rank === 3 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {item.rank === 1 ? <Crown className="w-6 h-6" /> : item.rank}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {getSignName(item)}
                          </h2>
                          <span className="text-xs text-slate-400 font-medium">
                            {getDateRange(item)}
                          </span>
                        </div>
                        {item.rank === 1 && (
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-amber-200 animate-bounce">
                            <Sparkles className="w-3 h-3" />
                            NO.1
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 leading-relaxed font-medium text-base sm:text-lg mb-6">
                        {getContent(item)}
                      </p>

                      <div className="bg-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-emerald-100/50 group-hover:bg-emerald-100/80 transition-colors">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm">
                          <Clover className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-sm">
                          <span className="font-black text-emerald-700 block mb-0.5 text-[10px] uppercase tracking-wider">
                            {i18n.language === 'en' ? 'Lucky Hint' : i18n.language === 'ja' ? 'ラッキー' : '행운의 비법'}
                          </span>
                          <span className="text-emerald-900 font-bold text-base">{getLucky(item)}</span>
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
