const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);
const rel = (f) => path.relative(P('.'), f);

const D = ['RestaurantPage', 'Header', 'MobileNav', 'Hero', 'MenuSection', 'Gallery', 'Reviews', 'SeaBlock', 'FeaturedDishes', 'CinematicRestaurants', 'EventModal', 'UniversalRestaurantSite'];

const collect = () => {
  const all = [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    e.isDirectory() ? walk(p) : (p.endsWith('.tsx') || p.endsWith('.ts')) && all.push(p);
  });
  walk(P('src'));
  return all;
};

D.forEach((name) => {
  const file = P('src/components/' + name + '.tsx');
  if (!fs.existsSync(file)) { console.log('ℹ ' + name + ': уже удалён'); return; }
  const all = collect();
  const re = new RegExp("from ['\"]\\.\\.?/components/" + name + "['\"]");
  const importers = all.filter((f) => f !== file && re.test(fs.readFileSync(f, 'utf-8')));
  const unsafe = importers.filter((f) => !D.includes(path.basename(f, '.tsx')));
  if (unsafe.length) { console.log('⚠ ' + name + ' НЕ удалён: импортируют ' + unsafe.map(rel).join(', ')); return; }
  fs.unlinkSync(file);
  console.log('✓ удалён components/' + name + '.tsx');
});

// Дамп модалок для Фазы 2
const dump = ['BookingModal', 'VacancyModal', 'PartnerModal'].map((n) => '===== ' + n + '.tsx =====\n' + fs.readFileSync(P('src/components/' + n + '.tsx'), 'utf-8')).join('\n\n');
fs.writeFileSync(P('modals-dump.txt'), dump, 'utf-8');
console.log('✓ modals-dump.txt создан (пришли его для Фазы 2)');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Рефактор Фаза 1: легаси удалён полностью"');
console.log('git pull --rebase');
console.log('git push');