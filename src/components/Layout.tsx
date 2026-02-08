import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--gradient-bg)' }}>
      {/* 별 배경 */}
      <div className="stars-background">
        <div className="stars-layer"></div>
      </div>

      <div className="flex-1 relative z-[1]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
