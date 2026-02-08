import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Database, Cookie, Share2, Mail, ArrowLeft, Moon, Sun } from 'lucide-react';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const sections = [
    {
      icon: Database,
      title: t('privacy_collect_title'),
      content: t('privacy_collect_desc'),
    },
    {
      icon: Cookie,
      title: t('privacy_cookies_title'),
      content: t('privacy_cookies_desc'),
    },
    {
      icon: Share2,
      title: t('privacy_third_title'),
      content: t('privacy_third_desc'),
    },
    {
      icon: Mail,
      title: t('privacy_contact_title'),
      content: t('privacy_contact_desc'),
    },
  ];

  return (
    <>
      <SEO
        title={t('privacy_title')}
        description={t('privacy_intro')}
        canonical="https://ohaasa.site/privacy"
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                  <Shield className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  {t('privacy_title')}
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
          <div
            className="rounded-3xl shadow-lg p-6 mb-6 theme-transition"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('privacy_intro')}
            </p>
          </div>

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
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: February 2026
          </div>
        </main>
      </div>
    </>
  );
}
