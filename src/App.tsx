import RestaurantPage from './sites/RestaurantPage';
import { restaurants as restList } from './data/holding';
import { useEffect, useState } from 'react';
import Holding from './pages/Holding';

const clean = (p: string) => p.replace(/\/+$/, '') || '/';

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    // старые ссылки с # → сразу в чистый путь
    if (window.location.hash.startsWith('#/')) {
      const p = window.location.hash.slice(1) || '/';
      window.history.replaceState({}, '', p);
      return clean(p);
    }
    return clean(window.location.pathname);
  });

  useEffect(() => {
    const onPop = () => {
      setRoute(clean(window.location.pathname));
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);

    // перехват всех старых ссылок вида #/kinza и #/
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const a = t && t.closest ? (t.closest('a[href^="#/"]') as HTMLAnchorElement | null) : null;
      if (!a) return;
      e.preventDefault();
      const p = (a.getAttribute('href') || '#/').slice(1) || '/';
      window.history.pushState({}, '', p);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  if (route.startsWith('/kinza')) return <RestaurantPage restaurant={restList.find((r) => r.id === 'kinza')!} />;
  if (route.startsWith('/nino')) return <RestaurantPage restaurant={restList.find((r) => r.id === 'nino')!} />;
  if (route.startsWith('/astoria')) return <RestaurantPage restaurant={restList.find((r) => r.id === 'astoria')!} />;
  if (route.startsWith('/la-costa')) return <RestaurantPage restaurant={restList.find((r) => r.id === 'la-costa')!} />;
  return <Holding />;
}
