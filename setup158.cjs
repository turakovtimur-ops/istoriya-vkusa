const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const P = (f) => path.join(__dirname, f);
const rel = (f) => path.relative(P('.'), f);

// ================= 1) Восстанавливаем ЖИВОЙ EventModal =================
try {
  execSync('git checkout -- src/components/EventModal.tsx', { stdio: 'pipe' });
  console.log('✓ EventModal восстановлен (он живой — заявки на мероприятия)');
} catch (e) {
  console.log('⚠ git checkout не сработал, выполни вручную: git checkout -- src/components/EventModal.tsx');
}

// ================= 2) Удаляем мёртвую цепочку целиком =================
const DEAD = [
  'src/sites/KinzaSite_old.tsx', 'src/sites/AstoriaSite.tsx', 'src/sites/LaCostaSite.tsx', 'src/sites/NinoSite.tsx',
  'src/components/Header.tsx', 'src/components/MobileNav.tsx', 'src/components/Hero.tsx', 'src/components/MenuSection.tsx',
  'src/components/Gallery.tsx', 'src/components/Reviews.tsx', 'src/components/SeaBlock.tsx',
  'src/components/FeaturedDishes.tsx', 'src/components/UniversalRestaurantSite.tsx',
];
const deadNames = DEAD.map((d) => path.basename(d, '.tsx'));

const all = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name);
  if (['node_modules', '.git', 'dist'].includes(e.name)) return;
  e.isDirectory() ? walk(p) : (p.endsWith('.tsx') || p.endsWith('.ts')) && all.push(p);
});
walk(P('src'));

DEAD.forEach((d) => {
  const file = P(d);
  if (!fs.existsSync(file)) { console.log('ℹ ' + path.basename(d) + ': уже удалён'); return; }
  const name = path.basename(d, '.tsx');
  const re = new RegExp("from ['\"](\\.\\.?/)?(components/|sites/)?" + name + "['\"]");
  const importers = all.filter((f) => fs.existsSync(f) && f !== file && re.test(fs.readFileSync(f, 'utf-8')));
  const unsafe = importers.filter((f) => !deadNames.includes(path.basename(f, '.tsx')));
  if (unsafe.length) { console.log('⚠ ' + name + ' НЕ удалён: импортируют ' + unsafe.map(rel).join(', ')); return; }
  fs.unlinkSync(file);
  console.log('✓ удалён ' + d);
});

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Рефактор: мёртвая цепочка удалена, EventModal на месте"');
console.log('git pull --rebase');
console.log('git push');