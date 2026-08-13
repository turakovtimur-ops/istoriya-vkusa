import { useEffect, useState } from 'react';
import Holding from './pages/Holding';
import KinzaSite from './sites/KinzaSite';
import NinoSite from './sites/NinoSite';
import AstoriaSite from './sites/AstoriaSite';
import LaCostaSite from './sites/LaCostaSite';
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

  if (route.startsWith('/kinza')) return <KinzaSite />;
  if (route.startsWith('/nino')) return <NinoSite />;
  if (route.startsWith('/astoria')) return <AstoriaSite />;
  if (route.startsWith('/la-costa')) return <LaCostaSite />;

  return <Holding />;
}