const fs = require('fs');
const path = require('path');

// ---------- 1) App.tsx: убираем старые сайты, ставим RestaurantPage ----------
let app = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf-8');

for (const name of ['KinzaSite', 'NinoSite', 'AstoriaSite', 'LaCostaSite', 'UniversalRestaurantSite']) {
  const re = new RegExp("import " + name + " from ['\\\"][^'\\\"]*['\\\"];?\\n", 'g');
  if (re.test(app)) { app = app.replace(re, ''); console.log('✓ App: убран импорт', name); }
}

if (!app.includes("import RestaurantPage")) {
  app = "import RestaurantPage from './sites/RestaurantPage';\nimport { restaurants as restList } from './data/holding';\n" + app;
  console.log('✓ App: добавлен импорт RestaurantPage');
}

const map = { KinzaSite: 'kinza', NinoSite: 'nino', AstoriaSite: 'astoria', LaCostaSite: 'la-costa', UniversalRestaurantSite: null };
for (const [comp, id] of Object.entries(map)) {
  if (!id) continue;
  const reUse = new RegExp('<' + comp + '(\\s[^>]*)?/>', 'g');
  const repl = "<RestaurantPage restaurant={restList.find(r => r.id === '" + id + "')!} />";
  if (reUse.test(app)) { app = app.replace(reUse, repl); console.log('✓ App: <' + comp + '> заменён на RestaurantPage'); }
}

if (app.includes('KinzaSite') || app.includes('NinoSite') || app.includes('AstoriaSite') || app.includes('LaCostaSite')) {
  console.warn('⚠ в App.tsx остались упоминания старых сайтов — вывожу файл:');
  console.log(app);
} else {
  console.log('✓ App.tsx чистый');
}
fs.writeFileSync(path.join(__dirname, 'src', 'App.tsx'), app, 'utf-8');

// ---------- 2) Holding.tsx: убираем лишний импорт и renderRestaurant ----------
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const before = h;
h = h.split('\n').filter((l) => !l.includes("import RestaurantPage from '../sites/RestaurantPage'")).join('\n');
if (h.includes('function renderRestaurant')) {
  const s = h.indexOf('function renderRestaurant');
  const e = h.indexOf('export default function Holding');
  if (s !== -1 && e !== -1 && s < e) h = h.slice(0, s) + h.slice(e);
  console.log('✓ Holding: убран renderRestaurant');
}
if (h !== before) {
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
  console.log('✓ Holding: лишние импорты убраны');
} else console.log('✓ Holding: уже чистый');

console.log('\n✅ Готово. Дальше: npm run dev → проверь #/kinza #/nino #/astoria #/la-costa');
console.log('Если ок: npm run build && git add -A && git commit -m "Единый шаблон ресторанов" && git push --force');