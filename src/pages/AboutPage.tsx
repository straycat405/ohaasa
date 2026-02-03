import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, Database, Globe, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

export default function AboutPage() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const sections = [
    {
      icon: Star,
      title: t('about_service_title'),
      content: t('about_service_desc'),
    },
    {
      icon: Database,
      title: t('about_source_title'),
      content: t('about_source_desc'),
      note: t('about_source_note'),
      link: {
        url: 'https://www.asahi.co.jp/ohaasa/week/horoscope/',
        text: t('about_source_link'),
      },
    },
    {
      icon: Globe,
      title: t('about_translation_title'),
      content: t('about_translation_desc'),
    },
    {
      icon: AlertCircle,
      title: t('about_disclaimer_title'),
      content: t('about_disclaimer_desc'),
    },
  ];

  return (
    <>
      <SEO 
        title={t('about_title')}
        description={t('about_service_desc')}
        canonical="https://ohaasa.site/about"
      />

      <div className="pb-12">
        <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('nav_home')}
                </Link>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  {t('about_title')}
                </h1>
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
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                    {section.note && (
                      <p className="text-sm text-amber-600 mt-2">
                        {section.note}
                      </p>
                    )}
                    {section.link && (
                      <a
                        href={section.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        {section.link.text}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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
