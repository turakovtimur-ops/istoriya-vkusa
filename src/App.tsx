import { useEffect, useState } from 'react';
import Holding from './pages/Holding';
import Admin from './pages/Admin';
import RestaurantPage from './sites/RestaurantPage';
import { restaurants } from './data/holding';

export default function App() {
  const [pathName, setPathName] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    const onPop = () => {
      setPathName(window.location.pathname);
      window.scrollTo(0, 0);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const a = t.closest ? (t.closest('a[href]') as HTMLAnchorElement | null) : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (a.target === '_blank' || /\.(pdf|jpe?g|png|webp|svg|xml|txt|ico)(\?.*)?$/i.test(href)) return;
      if (href.startsWith('#/')) {
        e.preventDefault();
        const to = href.slice(1) || '/';
        window.history.pushState({}, '', to);
        setPathName(to);
        window.scrollTo(0, 0);
      }

      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        setPathName(href);
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const clean = pathName.replace(/\/+$/, '') || '/';
  if (clean === '/upravlenie') return <Admin />;
  const rest = restaurants.find((r) => clean === r.path || clean === '/' + r.path || clean === '/' + r.id);
  if (rest) return <RestaurantPage restaurant={rest} />;
  return <Holding />;
}
