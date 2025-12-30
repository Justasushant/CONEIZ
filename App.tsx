import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Legal from './pages/Legal';

const App: React.FC = () => {
  const getInitialRoute = () => {
    try {
      return window.location.hash.replace('#', '') || '/';
    } catch (e) {
      return '/';
    }
  };

  const [route, setRoute] = useState(getInitialRoute());

  useEffect(() => {
    const handleAppNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const path = customEvent.detail;
      setRoute(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#/')) {
          e.preventDefault();
          const path = href.replace('#', '');
          window.dispatchEvent(new CustomEvent('app-navigate', { detail: path }));
        }
      }
    };

    window.addEventListener('app-navigate', handleAppNavigate);
    window.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('app-navigate', handleAppNavigate);
      window.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const renderPage = () => {
      switch (route) {
          case '/': return <Home />;
          case '/services': return <Services />;
          case '/products': return <Products />;
          case '/about': return <About />;
          case '/blog': return <Blog />;
          case '/contact': return <Contact />;
          case '/legal': return <Legal />;
          default: return <Home />;
      }
  };

  return (
      <Layout>
        <div key={route} className="animate-page-enter">
          {renderPage()}
        </div>
      </Layout>
  );
};

export default App;