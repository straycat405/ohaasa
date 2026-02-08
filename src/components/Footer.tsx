import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-10 theme-transition"
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--header-bg)'
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('nav_home')}
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('nav_about')}
          </Link>
          <Link
            to="/privacy"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('nav_privacy')}
          </Link>
          <Link
            to="/terms"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('nav_terms')}
          </Link>
        </nav>

        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {t('footer_copyright')} &copy; {currentYear}
          </p>
          <p className="text-xs mt-2 uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            {t('footer_powered')}
          </p>
        </div>
      </div>
    </footer>
  );
}
