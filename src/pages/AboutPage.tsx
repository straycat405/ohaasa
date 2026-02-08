import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, Database, Globe, AlertCircle, ArrowLeft, ExternalLink, Moon, Sun, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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
      link: {
        url: 'https://www.asahi.co.jp/ohaasa/week/horoscope/',
        text: t('about_source_link'),
      },
      link2: {
        url: 'https://www.tv-asahi.co.jp/goodmorning/uranai/',
        text: t('about_source_link2'),
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
    {
      icon: Mail,
      title: t('about_contact_title'),
      content: t('about_contact_desc'),
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
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium mb-2 transition-colors hover:opacity-80"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('nav_home')}
                </Link>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t('about_title')}
                </h1>
              </div>

              <div className="flex items-center gap-3">
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
            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-3xl shadow-lg p-6 transition-all hover:shadow-xl theme-transition"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--bg-accent)' }}
                  >
                    <section.icon className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {section.title}
                    </h2>
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {section.content}
                    </p>
                    {section.link && (
                      <a
                        href={section.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 font-medium transition-colors hover:opacity-80"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {section.link.text}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {section.link2 && (
                      <a
                        href={section.link2.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 ml-0 sm:ml-4 font-medium transition-colors hover:opacity-80"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {section.link2.text}
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
