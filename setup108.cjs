const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) vercel.json: все пути → index.html =================
fs.writeFileSync(P('vercel.json'), JSON.stringify({
  rewrites: [{ source: '/(.*)', destination: '/index.html' }]
}, null, 2), 'utf-8');
console.log('✓ vercel.json: rewrites для чистых адресов');

// ================= 2) App.tsx: path-роутинг + перехват старых #/-ссылок =================
fs.writeFileSync(P('src/App.tsx'), `import RestaurantPage from './sites/RestaurantPage';
import { restaurants as restList } from './data/holding';
import { useEffect, useState } from 'react';
import Holding from './pages/Holding';

const clean = (p: string) => p.replace(/\\/+$/, '') || '/';

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
`, 'utf-8');
console.log('✓ App.tsx: чистые адреса + авто-редирект старых #');

// ================= 3) Holding.tsx: hash → pathname =================
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const oldBlock = "const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.hash : '');\n  useEffect(() => {\n    const onHash = () => { setRoute(window.location.hash); window.scrollTo(0, 0); };\n    window.addEventListener('hashchange', onHash);\n    return () => window.removeEventListener('hashchange', onHash);\n  }, []);\n  const curRoute = route.replace(/^#/, '');";
const newBlock = "const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.pathname : '');\n  useEffect(() => {\n    const onPop = () => { setRoute(window.location.pathname); window.scrollTo(0, 0); };\n    window.addEventListener('popstate', onPop);\n    return () => window.removeEventListener('popstate', onPop);\n  }, []);\n  const curRoute = route.replace(/\\/+$/, '');";
if (h.includes(oldBlock)) {
  h = h.split(oldBlock).join(newBlock);
  fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');
  console.log('✓ Holding.tsx: роутинг на pathname');
} else console.log('⚠ Holding: блок роутинга не найден — проверь вручную');

// ================= 4) sitemap.xml: все страницы =================
fs.writeFileSync(P('public/sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  '  <url><loc>https://www.istoriya-vkusa.ru/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n' +
  '  <url><loc>https://www.istoriya-vkusa.ru/kinza</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n' +
  '  <url><loc>https://www.istoriya-vkusa.ru/nino</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n' +
  '  <url><loc>https://www.istoriya-vkusa.ru/astoria</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n' +
  '  <url><loc>https://www.istoriya-vkusa.ru/la-costa</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>\n' +
  '</urlset>\n', 'utf-8');
console.log('✓ sitemap.xml: 5 страниц');

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Чистые URL без # + sitemap" && git push');