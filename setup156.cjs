const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);
const rel = (f) => path.relative(P('.'), f);

// ================= 1) App.tsx: SPA-переходы по чистым ссылкам =================
let app = fs.readFileSync(P('src/App.tsx'), 'utf-8');
const app0 = app;
app = app.replace(/(\s*)if \(href\.startsWith\('#\/'\)\) \{[\s\S]*?window\.scrollTo\(0, 0\);\n\s*\}/,
  (m, sp) => m + '\n' + sp + "if (href.startsWith('/') && !href.startsWith('//')) {" +
    sp + '  e.preventDefault();' +
    sp + "  window.history.pushState({}, '', href);" +
    sp + '  setPathName(href);' +
    sp + '  window.scrollTo(0, 0);' + sp + '}');
if (app !== app0) { fs.writeFileSync(P('src/App.tsx'), app, 'utf-8'); console.log('✓ App: чистые ссылки ходят без перезагрузки'); }
else console.log('⚠ App: якорь не найден');

// ================= 2) Holding.tsx: убираем мёртвую hash-ветку =================
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const h0 = h;
h = h.replace(/import RestaurantPage from '\.\.\/components\/RestaurantPage';\n/, '');
h = h.replace(/\/\/ Страницы ресторанов по hash[\s\S]*?curRoute === '\/' \+ r\.path\);/, '');
h = h.replace(/if \(activeRest\) return <RestaurantPage r=\{activeRest\} \/>;/, '');
h = h.split("href={'#' + r.path}").join('href={r.path}');
if (h !== h0) { fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8'); console.log('✓ Holding: легаси-ветка удалена, ссылки чистые'); }
else console.log('⚠ Holding: правки не применились');

// ================= 3) OrbitHero: чистые ссылки на планеты =================
let oh = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const oh0 = oh;
oh = oh.split("href={'#' + r.path}").join('href={r.path}');
if (oh !== oh0) { fs.writeFileSync(P('src/components/OrbitHero.tsx'), oh, 'utf-8'); console.log('✓ OrbitHero: ссылки чистые'); }

// ================= 4) Удаляем легаси (только если безопасно) =================
const D = ['RestaurantPage', 'Header', 'MobileNav', 'Hero', 'MenuSection', 'Gallery', 'Reviews', 'SeaBlock', 'FeaturedDishes', 'CinematicRestaurants', 'EventModal', 'UniversalRestaurantSite'];
const all = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name);
  if (['node_modules', '.git', 'dist'].includes(e.name)) return;
  e.isDirectory() ? walk(p) : (p.endsWith('.tsx') || p.endsWith('.ts')) && all.push(p);
});
walk(P('src'));
D.forEach((name) => {
  const file = P('src/components/' + name + '.tsx');
  if (!fs.existsSync(file)) return;
  const re = new RegExp("from ['\"]\\.\\.?/components/" + name + "['\"]");
  const importers = all.filter((f) => f !== file && re.test(fs.readFileSync(f, 'utf-8')));
  const unsafe = importers.filter((f) => !D.includes(path.basename(f, '.tsx')));
  if (unsafe.length) { console.log('⚠ ' + name + ' НЕ удалён: импортируют ' + unsafe.map(rel).join(', ')); return; }
  fs.unlinkSync(file);
  console.log('✓ удалён components/' + name + '.tsx');
});

// ================= 5) Дамп модалок для Фазы 2 =================
const dump = ['BookingModal', 'VacancyModal', 'PartnerModal'].map((n) => '===== ' + n + '.tsx =====\n' + fs.readFileSync(P('src/components/' + n + '.tsx'), 'utf-8')).join('\n\n');
fs.writeFileSync(P('modals-dump.txt'), dump, 'utf-8');
console.log('✓ modals-dump.txt создан (пришли его для Фазы 2)');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Рефактор Фаза 1: легаси удалён, чистые URL"');
console.log('git pull --rebase');
console.log('git push');