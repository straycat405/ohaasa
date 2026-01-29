import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Star, Sparkles, Crown, Gift } from 'lucide-react';

interface Horoscope {
  rank: number;
  zodiac: {
    jp: string;
    ko: string;
    en: string;
  };
  content: {
    ko: string;
    en: string;
  };
  lucky: {
    ko: string;
    en: string;
  };
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

  const getZodiacName = (item: Horoscope) => {
    if (i18n.language === 'ko') return item.zodiac?.ko || '';
    if (i18n.language === 'en') return item.zodiac?.en || '';
    return item.zodiac?.jp || '';
  };

  const getContent = (item: Horoscope) => {
    if (i18n.language === 'en') return item.content?.en || '';
    return item.content?.ko || '';
  };

  const getLucky = (item: Horoscope) => {
    if (i18n.language === 'en') return item.lucky?.en || '';
    return item.lucky?.ko || '';
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-1';
      case 2: return 'rank-2';
      case 3: return 'rank-3';
      default: return 'rank-default';
    }
  };

  // Format date for display (e.g., 20260130 -> 1月30日 or 1/30)
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const month = parseInt(dateStr.substring(4, 6));
      const day = parseInt(dateStr.substring(6, 8));
      return i18n.language === 'ja' ? `${month}月${day}일` : `${month}/${day}`;
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4 animate-pulse shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-purple-600 font-display">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!data?.horoscope) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-sm mx-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">데이터를 불러올 수 없습니다</h2>
          <p className="text-slate-500 text-sm">현재 운세 정보를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
          >
            새로고침
          </button>
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
              <p className="text-sm text-slate-500 mt-1">{formatDisplayDate(data?.date)} | {t('subtitle')}</p>
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
          {data?.horoscope.sort((a, b) => a.rank - b.rank).map((item, index) => (
            <div
              key={index}
              className={`horoscope-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${
                item.rank === 1 ? 'ring-2 ring-purple-100 shadow-lg' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={`rank-badge shrink-0 ${getRankClass(item.rank)}`}>
                    {item.rank === 1 ? <Crown className="w-4 h-4" /> : item.rank}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-slate-800">
                        {getZodiacName(item)}
                      </h2>
                      {item.rank === 1 && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                          <Sparkles className="w-3 h-3" />
                          LUCKY
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                      {getContent(item)}
                    </p>

                    {/* Lucky Item Section */}
                    <div className="bg-rose-50/50 rounded-xl p-3 flex items-center gap-3 border border-rose-100/50">
                      <div className="bg-rose-100 p-2 rounded-lg">
                        <Gift className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="text-sm">
                        <span className="font-bold text-rose-600 mr-2">{i18n.language === 'en' ? 'Lucky Secret:' : '행운의 비법:'}</span>
                        <span className="text-rose-500 font-medium">{getLucky(item)}</span>
                      </div>
                    </div>
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
          Powered by Gemini AI | Data from Asahi TV
        </p>
      </footer>
    </div>
  );
}

export default App;
