import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Bendras puslapio karkasas: header + turinys + footer
export default function Layout() {
  const { pathname } = useLocation();

  // Pakeitus puslapį – grįžtame į viršų
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      {/* key – kiekvienas naujas puslapis "įvažiuoja" su animacija (styles/animations.css) */}
      <main id="main" className="site-main" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
