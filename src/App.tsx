import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Star, Sparkles } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-medium animate-pulse flex items-center gap-2">
            <Sparkles className="text-yellow-500" />
            {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <Star className="fill-indigo-600" />
              {t('title')}
            </h1>
            <p className="text-sm text-slate-500">{data?.date} | {t('subtitle')}</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['ko', 'ja', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  i18n.language === lang ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t(`lang_${lang}`)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.horoscope.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow ${
                item.rank === '1' ? 'ring-2 ring-yellow-400 border-transparent' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-black ${
                      item.rank === '1' ? 'text-yellow-500' : 'text-slate-400'
                    }`}>
                      {item.rank}
                    </span>
                    <h2 className="text-xl font-bold">{getSignName(item)}</h2>
                  </div>
                  {item.rank === '1' && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Lucky No.1
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {item.content}
                    </p>
                    
                    <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold">
                            <Sparkles size={16} />
                            {t('luckyItem')}
                        </div>
                        {/* Note: The scraped content usually includes the item at the end. 
                            We display the full content for now as Japanese text is mixed. */}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="text-center text-slate-400 text-sm mt-8">
        &copy; 2026 {t('title')} - Data from Asahi TV
      </footer>
    </div>
  );
}

export default App;