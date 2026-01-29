import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Star, Sparkles, Crown } from 'lucide-react';

interface Horoscope {
  rank: string;
  jpName: string;
  ko: string;
  en: string;
  content: string;
}

interface HoroscopeData {
  date: string;
  horoscope: Horoscope[];
}

function App() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.DEV
          ? 'http://localhost:3001/api/horoscope'
          : '/api/horoscope';
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching horoscope:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getSignName = (item: Horoscope) => {
    if (i18n.language === 'ko') return item.ko;
    if (i18n.language === 'en') return item.en;
    return item.jpName;
  };

  const getRankClass = (rank: string) => {
    switch (rank) {
      case '1': return 'rank-1';
      case '2': return 'rank-2';
      case '3': return 'rank-3';
      default: return 'rank-default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-purple-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-2">
                <Star className="w-6 h-6 text-purple-500 fill-purple-200" />
                {t('title')}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{data?.date} | {t('subtitle')}</p>
            </div>

            <div className="flex bg-purple-50 p-1 rounded-full">
              {['ko', 'ja', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    i18n.language === lang
                      ? 'bg-white shadow-sm text-purple-600'
                      : 'text-slate-500 hover:text-purple-600'
                  }`}
                >
                  {t(`lang_${lang}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {data?.horoscope.map((item, index) => (
            <div
              key={index}
              className={`horoscope-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${
                item.rank === '1' ? 'top-card shadow-lg' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`rank-badge ${getRankClass(item.rank)}`}>
                    {item.rank === '1' ? <Crown className="w-4 h-4" /> : item.rank}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-bold text-slate-800">
                        {getSignName(item)}
                      </h2>
                      {item.rank === '1' && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          LUCKY
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-slate-400 text-sm">
          {t('title')} &copy; 2026
        </p>
        <p className="text-slate-300 text-xs mt-1">
          Data from Asahi TV
        </p>
      </footer>
    </div>
  );
}

export default App;
