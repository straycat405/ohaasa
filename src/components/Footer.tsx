import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 mt-10 bg-white/50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
          <Link
            to="/"
            className="text-slate-500 hover:text-emerald-600 text-sm font-medium transition-colors"
          >
            {t('nav_home')}
          </Link>
          <Link
            to="/about"
            className="text-slate-500 hover:text-emerald-600 text-sm font-medium transition-colors"
          >
            {t('nav_about')}
          </Link>
          <Link
            to="/privacy"
            className="text-slate-500 hover:text-emerald-600 text-sm font-medium transition-colors"
          >
            {t('nav_privacy')}
          </Link>
          <Link
            to="/terms"
            className="text-slate-500 hover:text-emerald-600 text-sm font-medium transition-colors"
          >
            {t('nav_terms')}
          </Link>
        </nav>

        <div className="text-center">
          <p className="text-slate-400 text-sm font-semibold tracking-wide">
            {t('footer_copyright')} &copy; {currentYear}
          </p>
          <p className="text-slate-300 text-xs mt-2 uppercase tracking-[0.2em] font-medium">
            {t('footer_powered')}
          </p>
        </div>
      </div>
    </footer>
  );
}
