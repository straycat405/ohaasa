import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, Play, Heart, Copyright, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function TermsPage() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const sections = [
    {
      icon: Play,
      title: t('terms_use_title'),
      content: t('terms_use_desc'),
    },
    {
      icon: Heart,
      title: t('terms_entertainment_title'),
      content: t('terms_entertainment_desc'),
    },
    {
      icon: Copyright,
      title: t('terms_ip_title'),
      content: t('terms_ip_desc'),
    },
    {
      icon: AlertTriangle,
      title: t('terms_warranty_title'),
      content: t('terms_warranty_desc'),
    },
    {
      icon: RefreshCw,
      title: t('terms_changes_title'),
      content: t('terms_changes_desc'),
    },
  ];

  return (
    <>
      <SEO 
        title={t('terms_title')}
        description={t('terms_intro')}
        canonical="https://ohayoasa.pages.dev/terms"
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-500" />
                  {t('terms_title')}
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
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
            <p className="text-slate-600 leading-relaxed">
              {t('terms_intro')}
            </p>
          </div>

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
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            Last updated: January 2026
          </div>
        </main>
      </div>
    </>
  );
}
