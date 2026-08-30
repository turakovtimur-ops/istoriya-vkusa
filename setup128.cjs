const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) App.tsx начисто =================
fs.writeFileSync(P('src/App.tsx'), `import { useEffect, useState } from 'react';
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
      if (href.startsWith('#/')) {
        e.preventDefault();
        const to = href.slice(1) || '/';
        window.history.pushState({}, '', to);
        setPathName(to);
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

  const clean = pathName.replace(/\\/+$/, '') || '/';
  if (clean === '/upravlenie') return <Admin />;
  const rest = restaurants.find((r) => clean === r.path || clean === '/' + r.path || clean === '/' + r.id);
  if (rest) return <RestaurantPage restaurant={rest} />;
  return <Holding />;
}
`, 'utf-8');
console.log('✓ App.tsx переписан начисто: /upravlenie + рестораны + холдинг');

// ================= 2) vercel.json: чтобы /upravlenie открывался =================
const vj = P('vercel.json');
let v = {};
try { v = JSON.parse(fs.readFileSync(vj, 'utf-8')); } catch (e) {}
v.rewrites = v.rewrites || [];
if (!v.rewrites.some((r) => r.source === '/(.*)')) {
  v.rewrites.push({ source: '/(.*)', destination: '/index.html' });
  fs.writeFileSync(vj, JSON.stringify(v, null, 2), 'utf-8');
  console.log('✓ vercel.json: catch-all rewrite добавлен');
} else console.log('ℹ vercel.json: rewrite уже есть');

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Админка v1: фикс App + роут /upravlenie" && git push');