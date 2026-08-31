const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) overrides.ts + merge =================
fs.writeFileSync(P('src/data/overrides.ts'), `export function merge(base: any, over: any): any {
  if (over === undefined || over === null) return base;
  if (Array.isArray(over)) return over;
  if (typeof over === 'object' && typeof base === 'object' && base && !Array.isArray(base)) {
    const out: any = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over;
}
export const OVERRIDES: Record<string, any> = {};
`, 'utf-8');
console.log('✓ src/data/overrides.ts');

// ================= 2) api/read.ts (админка читает файлы) =================
fs.writeFileSync(P('api/read.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['x-gh-token'] as string;
  const p = (req.query.path as string) || '';
  if (!token || !p) return res.status(400).json({ error: 'bad_request' });
  const r = await fetch('https://api.github.com/repos/turakovtimur-ops/istoriya-vkusa/contents/' + p, {
    headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'iv-admin' },
  });
  if (!r.ok) return res.status(r.status).json({ error: 'read', d: await r.text() });
  const j = await r.json();
  return res.status(200).json({ text: Buffer.from(j.content, 'base64').toString('utf-8') });
}
`, 'utf-8');
console.log('✓ api/read.ts');

// ================= 3) EditMode.tsx =================
fs.writeFileSync(P('src/components/EditMode.tsx'), `import { useEffect } from 'react';
export default function EditMode() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('edit') !== '1') return;
    document.body.classList.add('edit-mode');
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest ? ((e.target as HTMLElement).closest('[data-e]') as HTMLElement | null) : null;
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      const kind = t.getAttribute('data-kind') || 'text';
      window.parent.postMessage({
        type: 'iv-edit',
        path: t.getAttribute('data-e') || '',
        kind,
        value: kind === 'image' ? (t.getAttribute('src') || '') : (t.textContent || '').trim(),
      }, '*');
    };
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('click', onClick, true); document.body.classList.remove('edit-mode'); };
  }, []);
  return null;
}
`, 'utf-8');
console.log('✓ EditMode.tsx');

// ================= 4) CSS подсветки =================
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup161')) {
  css += `
/* ===== setup161: режим правки ===== */
body.edit-mode [data-e] { outline: 1px dashed rgba(194,160,118,0.55); outline-offset: 2px; cursor: pointer; }
body.edit-mode [data-e]:hover { outline: 2px solid #C2A078; background: rgba(194,160,118,0.08); }
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: подсветка data-e');
}

// ================= 5) App.tsx: EditMode во всех ветках =================
let app = fs.readFileSync(P('src/App.tsx'), 'utf-8');
if (!app.includes('EditMode')) {
  app = app.split("import Admin from './pages/Admin';").join("import Admin from './pages/Admin';\nimport EditMode from './components/EditMode';");
  app = app.split("if (clean === '/upravlenie') return <Admin />;").join("if (clean === '/upravlenie') return (<><EditMode /><Admin /></>);");
  app = app.split("if (rest) return <RestaurantPage restaurant={rest} />;").join("if (rest) return (<><EditMode /><RestaurantPage restaurant={rest} /></>);");
  app = app.split("return <Holding />;").join("return (<><EditMode /><Holding /></>);");
  fs.writeFileSync(P('src/App.tsx'), app, 'utf-8');
  console.log('✓ App: EditMode подключён');
}

// ================= 6) Holding.tsx: merge overrides + теги =================
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const h0 = h;
h = h.split("import { restaurants, partners, promos, history, holdingBrand, team, vacancies, benefits, Partner } from '../data/holding';")
  .join("import { restaurants as restaurantsBase, partners as partnersBase, promos, history as historyBase, holdingBrand as holdingBrandBase, team as teamBase, vacancies, benefits, Partner } from '../data/holding';\nimport { OVERRIDES, merge } from '../data/overrides';");
if (!h.includes('const O = OVERRIDES')) {
  h = h.split('const STARS =').join(`const O = OVERRIDES as any;
const restaurants = merge(restaurantsBase, O.restaurants);
const partners = merge(partnersBase, O.partners);
const history = merge(historyBase, O.history);
const holdingBrand = merge(holdingBrandBase, O.holdingBrand);
const team = merge(teamBase, O.team);
const ui = merge({ teamTitle: 'Люди, которые создают вкус', restTitle: 'Четыре характера', partnersTitle: 'Нам доверяют', newsTitle: 'Новости и анонсы' }, O.ui);
const STARS =`);
}
// теги data-e (тексты)
const pairs = [
  [/<h2 (className="[^"]*tracking-\[1\.02\]")>\{history\.title\}<\/h2>/, '<h2 data-e="history.title" $1>{history.title}</h2>'],
  [/<p key=\{i\}>\{p\}<\/p>/, '<p key={i} data-e={\'history.paragraphs.\' + i}>{p}</p>'],
  [/<p className="text-amber text-\[10px\] uppercase tracking-\[0\.3em\] mb-2 font-medium">\{t\.role\}<\/p>/, '<p data-e={\'team.\' + i + \'.role\'} className="text-amber text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">{t.role}</p>'],
  [/<h3 className="text-2xl font-semibold tracking-tight mb-3">\{t\.name\}<\/h3>/, '<h3 data-e={\'team.\' + i + \'.name\'} className="text-2xl font-semibold tracking-tight mb-3">{t.name}</h3>'],
  [/<p className="text-cream\/60 text-sm font-light leading-relaxed max-w-xs mx-auto">\{t\.desc\}<\/p>/, '<p data-e={\'team.\' + i + \'.desc\'} className="text-cream/60 text-sm font-light leading-relaxed max-w-xs mx-auto">{t.desc}</p>'],
  [/<p className="text-amber text-\[9px\] uppercase tracking-\[0\.3em\] mb-1\.5 font-medium">\{team\[teamIdx\]\.role\}<\/p>/, '<p data-e={\'team.\' + teamIdx + \'.role\'} className="text-amber text-[9px] uppercase tracking-[0.3em] mb-1.5 font-medium">{team[teamIdx].role}</p>'],
  [/<h3 className="text-xl font-semibold tracking-tight mb-2">\{team\[teamIdx\]\.name\}<\/h3>/, '<h3 data-e={\'team.\' + teamIdx + \'.name\'} className="text-xl font-semibold tracking-tight mb-2">{team[teamIdx].name}</h3>'],
  [/<p className="text-cream\/60 text-xs font-light leading-relaxed">\{team\[teamIdx\]\.desc\}<\/p>/, '<p data-e={\'team.\' + teamIdx + \'.desc\'} className="text-cream/60 text-xs font-light leading-relaxed">{team[teamIdx].desc}</p>'],
  [/<p className="text-2xl font-semibold tracking-tight mb-1">\{r\.name\}<\/p>/, '<p data-e={\'restaurants.\' + r.id + \'.name\'} className="text-2xl font-semibold tracking-tight mb-1">{r.name}</p>'],
  [/<p className="text-cream\/60 text-sm font-light mb-4">\{r\.tagline\}<\/p>/, '<p data-e={\'restaurants.\' + r.id + \'.tagline\'} className="text-cream/60 text-sm font-light mb-4">{r.tagline}</p>'],
  [/<p className="text-xs text-cream\/50">\{r\.beach\} · \{r\.address\}<\/p>/, '<p data-e={\'restaurants.\' + r.id + \'.address\'} className="text-xs text-cream/50">{r.beach} · {r.address}</p>'],
  [/<h3 className="text-2xl font-semibold tracking-tight mb-2">\{p\.name\}<\/h3>/, '<h3 data-e={\'partners.\' + p.id + \'.name\'} className="text-2xl font-semibold tracking-tight mb-2">{p.name}</h3>'],
  [/<p className="text-cream\/60 text-sm font-light leading-relaxed mb-5">\{p\.desc\}<\/p>/, '<p data-e={\'partners.\' + p.id + \'.desc\'} className="text-cream/60 text-sm font-light leading-relaxed mb-5">{p.desc}</p>'],
  [/<h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Люди, которые создают вкус<\/h2>/, '<h2 data-e="ui.teamTitle" className="text-4xl md:text-6xl font-semibold tracking-tighter">{ui.teamTitle}</h2>'],
  [/<h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Четыре характера<\/h2>/, '<h2 data-e="ui.restTitle" className="text-4xl md:text-6xl font-semibold tracking-tighter">{ui.restTitle}</h2>'],
  [/<h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Нам доверяют<\/h2>/, '<h2 data-e="ui.partnersTitle" className="text-4xl md:text-6xl font-semibold tracking-tighter">{ui.partnersTitle}</h2>'],
  [/<h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Новости и анонсы<\/h2>/, '<h2 data-e="ui.newsTitle" className="text-4xl md:text-6xl font-semibold tracking-tighter">{ui.newsTitle}</h2>'],
];
let tagged = 0;
pairs.forEach(([re, rep]) => { const n = h; h = h.replace(re, rep); if (n !== h) tagged++; });
console.log('✓ Holding: тегов data-e = ' + tagged);
if (h !== h0) fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

// ================= 7) RestaurantPage.tsx: merge + теги =================
let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const rp0 = rp;
if (!rp.includes('OVERRIDES')) {
  rp = rp.split("import { RESTO_EXTRA } from '../data/resto-extra';")
    .join("import { RESTO_EXTRA } from '../data/resto-extra';\nimport { OVERRIDES } from '../data/overrides';");
  rp = rp.split('const extra = extra0;')
    .join('const extra = { ...extra0, ...((OVERRIDES as any).pages || {})[restaurantProp.id] } as typeof extra0;');
  rp = rp.split('const restaurant = { ...restaurantProp, ...((extra0 as { overrides?: Record<string, string> }).overrides || {}) };')
    .join('const restaurant = { ...restaurantProp, ...((extra0 as { overrides?: Record<string, string> }).overrides || {}), ...(((OVERRIDES as any).pages || {})[restaurantProp.id] || {}) };');
}
const rpPairs = [
  [/<p className="text-cream\/80 text-lg lg:text-xl font-light max-w-2xl leading-relaxed">\{restaurant\.tagline\}<\/p>/, '<p data-e={\'pages.\' + restaurant.id + \'.tagline\'} className="text-cream/80 text-lg lg:text-xl font-light max-w-2xl leading-relaxed">{restaurant.tagline}</p>'],
  [/<p className=\{cSoft \+ ' font-light text-lg leading-relaxed mb-10'\}>\{restaurant\.description\}<\/p>/, '<p data-e={\'pages.\' + restaurant.id + \'.description\'} className={cSoft + \' font-light text-lg leading-relaxed mb-10\'}>{restaurant.description}</p>'],
  [/<p className=\{'font-medium ' \+ cHead\}>\{restaurant\.address\}<\/p>/, '<p data-e={\'pages.\' + restaurant.id + \'.address\'} className={\'font-medium \' + cHead}>{restaurant.address}</p>'],
  [/<a href=\{tel\} className=\{'font-medium ' \+ cHead \+ ' hover:underline'\}>\{restaurant\.phone\}<\/a>/, '<a data-e={\'pages.\' + restaurant.id + \'.phone\'} href={tel} className={\'font-medium \' + cHead + \' hover:underline\'}>{restaurant.phone}</a>'],
  [/<p className=\{'text-sm ' \+ cMute \+ ' mt-1'\}>Ежедневно \{extra\.hours\}<\/p>/, '<p data-e={\'pages.\' + restaurant.id + \'.hours\'} className={\'text-sm \' + cMute + \' mt-1\'}>Ежедневно {extra.hours}</p>'],
  [/<p className=\{'text-xl font-medium ' \+ cHead\}>\{restaurant\.address\}<\/p>/, '<p data-e={\'pages.\' + restaurant.id + \'.address\'} className={\'text-xl font-medium \' + cHead}>{restaurant.address}</p>'],
  [/<a href=\{tel\} className=\{'text-xl font-medium ' \+ cHead \+ ' hover:underline block'\}>\{restaurant\.phone\}<\/a>/, '<a data-e={\'pages.\' + restaurant.id + \'.phone\'} href={tel} className={\'text-xl font-medium \' + cHead + \' hover:underline block\'}>{restaurant.phone}</a>'],
  [/<p className=\{'text-xl font-medium ' \+ cHead\}>Ежедневно \{extra\.hours\}<\/p>/, '<p data-e={\'pages.\' + restaurant.id + \'.hours\'} className={\'text-xl font-medium \' + cHead}>Ежедневно {extra.hours}</p>'],
];
let rTagged = 0;
rpPairs.forEach(([re, rep]) => { const n = rp; rp = rp.replace(re, rep); if (n !== rp) rTagged++; });
console.log('✓ RestaurantPage: тегов data-e = ' + rTagged);
if (rp !== rp0) fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Hover-редактор: фундамент (EditMode, overrides, теги)"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 ПРИШЛИ src/pages/Admin.tsx — вставлю вкладку «Редактор»!');