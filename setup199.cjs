const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ===== проверка PNG =====
['vk.png', 'max.png'].forEach((f) => {
  if (fs.existsSync(P('public/images/social/' + f))) console.log('✓ ' + f + ' на месте');
  else console.log('⚠ НЕТ файла public/images/social/' + f + ' — закинь его!');
});

// ===== ищем RestaurantPage =====
let target = null;
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes('export default function RestaurantPage')) target = p;
  });
};
walk(P('src'));
if (!target) { console.log('⚠ RestaurantPage не найден'); process.exit(1); }
console.log('✓ найден: ' + target);

let s = fs.readFileSync(target, 'utf-8');
const s0 = s;

// 1) пути иконок: svg → png
s = s.split('/images/social/vk.svg').join('/images/social/vk.png');
s = s.split('/images/social/max.svg').join('/images/social/max.png');

// 2) константа Еды (если вдруг нет)
if (!s.includes('KINZA_EDA_URL')) {
  s = s.replace(/const geo = \(id: string\) => GEO\[id\] \|\| \[38\.0776, 44\.5611\];/, "const geo = (id: string) => GEO[id] || [38.0776, 44.5611];\nconst KINZA_EDA_URL = 'https://eda.yandex.ru/r/kinza_1721032873?placeSlug=kinza_l37w6';");
}

// 3) жёлтая кнопка Еды в hero Кинзы (если ещё не встала)
if (!s.includes('eda-delivery-btn')) {
  s = s.replace(/<button\s+onClick=\{modal\.open\}\s+className="mt-8 self-start[^"]*"\s+style=\{btnStyle\}\s*>\s*Забронировать стол\s*<\/button>/, () =>
`<div className="mt-8 self-start flex flex-wrap items-center gap-4">
            <button onClick={modal.open} className="px-10 py-4 text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={btnStyle}>Забронировать стол</button>
            {restaurant.id === 'kinza' && (
              <a href={KINZA_EDA_URL} target="_blank" rel="noopener noreferrer" className="eda-delivery-btn inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: '#FFD60A', color: '#221c14' }}>
                <img src="/images/kinza/yandex-eda.png" alt="" className="w-6 h-6 rounded-md" />
                Заказать доставку
              </a>
            )}
          </div>`);
}

if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ RestaurantPage: PNG-иконки + кнопка Еды'); }
else console.log('⚠ ничего не изменилось');

console.log('Диагностика: eda-delivery-btn = ' + s.includes('eda-delivery-btn') + ', vk.png = ' + s.includes('vk.png'));

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "PNG-иконки VK/MAX + кнопка Еды в hero" && git pull --rebase && git push');