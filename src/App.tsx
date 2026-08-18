import RestaurantPage from './sites/RestaurantPage';
import { restaurants as restList } from './data/holding';
import { useEffect, useState } from 'react';
import Holding from './pages/Holding';
import RestaurantStub from './pages/RestaurantStub';

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/');
  useEffect(() => {
    const onChange = () => {
      setRoute(window.location.hash.replace('#', '') || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export default function App() {
  const route = useHashRoute();

  if (route.startsWith('/kinza')) return <RestaurantPage restaurant={restList.find(r => r.id === 'kinza')!} />;
  if (route.startsWith('/nino')) return <RestaurantPage restaurant={restList.find(r => r.id === 'nino')!} />;
  if (route.startsWith('/astoria')) return <RestaurantPage restaurant={restList.find(r => r.id === 'astoria')!} />;
  if (route.startsWith('/la-costa')) return <RestaurantPage restaurant={restList.find(r => r.id === 'la-costa')!} />;

  return <Holding />;
}