const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// Ищем RestaurantPage где угодно в src
let target = null;
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    if (e.isDirectory()) walk(p);
    else if ((p.endsWith('.tsx') || p.endsWith('.ts')) && fs.readFileSync(p, 'utf-8').includes('export default function RestaurantPage')) target = p;
  });
};
walk(P('src'));

if (!target) { console.log('⚠ RestaurantPage не найден в src — пришли структуру папки src/sites и src/pages'); process.exit(1); }
console.log('✓ найден: ' + target);

let s = fs.readFileSync(target, 'utf-8');
const s0 = s;
s = s.split("import BookingModal from '../components/BookingModal';")
  .join("import BookingModal from '../components/BookingModal';\nimport RestaurantPromos from '../components/RestaurantPromos';");
s = s.split('<section id="menu"')
  .join('<RestaurantPromos restaurant={restaurant} dark={dark} />\n    <section id="menu"');
if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ блок акций вставлен между «Ресторан» и «Меню»'); }
else console.log('⚠ якоря не найдены — пришли файл текстом');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Акции на страницах ресторанов (автофильтр)" && git pull --rebase && git push');