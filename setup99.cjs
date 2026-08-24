const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let holding = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
let data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');

// ================= 1) КАРТОЧКИ: фото вместо лого =================
const oldCard = '<RestaurantGallery r={r} />';
const newCard = '<img src={r.photo || r.image} alt={r.name} loading="lazy" onError={(e) => { const t = e.currentTarget as HTMLImageElement; if (!t.dataset.fb) { t.dataset.fb = "1"; t.src = r.image; } }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />';
if (holding.includes(oldCard)) {
  holding = holding.split(oldCard).join(newCard);
  console.log('✓ карточки: фото вместо лого (с фолбэком)');
} else console.log('⚠ карточки: RestaurantGallery не найден');

holding = holding.replace("import RestaurantGallery from '../components/RestaurantGallery';\n", '');

// photo в данных (идемпотентно)
if (!data.includes('photo?: string;')) data = data.replace('logo?: string;', 'logo?: string;\n  photo?: string;');
if (!data.includes('-photo.jpg')) {
  data = data.replace(/roundLogo: '(\/images\/([a-z-]+)\/[^']+)',/g, (m, p1, folder) =>
    m + "\n    photo: '/images/" + folder + '/' + folder + "-photo.jpg',");
}
fs.writeFileSync(P('src/data/holding.ts'), data, 'utf-8');
console.log('✓ данные: поле photo');

// ================= 2) ФУТЕР: центр + 2 строки =================
const oldFoot = '<img src={holdingBrand.fullLogo} alt="История Вкуса" className="h-24 lg:h-28 w-auto object-contain" />\n            <p className="text-cream/50 text-sm font-light">Сеть ресторанов и отелей · Геленджик</p>';
const newFoot = '<img src={holdingBrand.fullLogo} alt="История Вкуса" className="h-24 lg:h-28 w-auto object-contain" />\n            <p className="text-cream/50 text-sm font-light mt-5">Сеть ресторанов и отелей</p>\n            <p className="text-cream/50 text-sm font-light mt-1">Геленджик</p>';
if (holding.includes(oldFoot)) {
  holding = holding.replace(oldFoot, newFoot);
  const imgIdx = holding.indexOf('src={holdingBrand.fullLogo}');
  const divIdx = holding.lastIndexOf('<div>', imgIdx);
  if (divIdx !== -1 && imgIdx - divIdx < 300) {
    holding = holding.slice(0, divIdx) + '<div className="flex flex-col items-center text-center">' + holding.slice(divIdx + 5);
  }
  console.log('✓ футер: лого по центру, подпись в 2 строки с отступом');
} else console.log('⚠ футер: точный блок не найден');

// ================= 3) ВАКАНСИИ: ровный низ =================
if (holding.includes('<section id="vacancies" className="py-16 lg:py-24">')) {
  holding = holding.replace('<section id="vacancies" className="py-16 lg:py-24">', '<section id="vacancies" className="pt-16 lg:pt-24 pb-8 lg:pb-10">');
  console.log('✓ вакансии: нижний отступ секции уменьшен');
}
if (holding.includes('<div className="block">')) {
  holding = holding.replace('<div className="block">', '<div className="block -mt-4 lg:-mt-8">');
  console.log('✓ вакансии: орбита поднята');
}

// ================= 4) КАРТА: Астория + зум (в ContactsSection) =================
const csPath = P('src/components/ContactsSection.tsx');
if (fs.existsSync(csPath)) {
  let cs = fs.readFileSync(csPath, 'utf-8');
  // метка Астории: ближайшая пара координат к слову "Астория"
  const low = cs.toLowerCase();
  const astIdx = low.indexOf('астория');
  const pairs = [...cs.matchAll(/\[\s*44\.\d+\s*,\s*38\.\d+\s*\]/g)].map((m) => ({ s: m[0], i: m.index }));
  if (astIdx !== -1 && pairs.length) {
    let best = null;
    for (const p of pairs) { if (!best || Math.abs(p.i - astIdx) < Math.abs(best.i - astIdx)) best = p; }
    cs = cs.split(best.s).join('[44.555733, 38.064269]');
    console.log('✓ карта: метка Астории → 44.555733, 38.064269');
  } else console.log('⚠ карта: Астория/координаты не найдены');
  // зум при выборе
  const b = cs;
  cs = cs.replace(/\.setCenter\(([^)]*)\)/g, (m, a) => (a.includes(',') ? m : '.setCenter(' + a + ', 17)'));
  cs = cs.replace(/\.panTo\(([^)]*)\)/g, (m, a) => (a.includes('{') ? m : '.panTo(' + a + ', { zoom: 17 })'));
  if (cs !== b) console.log('✓ карта: зум 17 при выборе');
  else console.log('⚠ карта: setCenter/panTo не найдены — вывожу файл ниже');
  fs.writeFileSync(csPath, cs, 'utf-8');
  if (cs.includes('⚠') || true) {
    if (!cs.includes('.setCenter') && !cs.includes('.panTo')) {
      console.log('--- ContactsSection.tsx ---');
      console.log(fs.readFileSync(csPath, 'utf-8'));
    }
  }
} else console.log('⚠ ContactsSection.tsx не найден');

fs.writeFileSync(P('src/pages/Holding.tsx'), holding, 'utf-8');

console.log('\n✅ Готово. Проверь localhost:5173 (Cmd+Shift+R):');
console.log('   1) карточки с фото  2) футер по центру  3) вакансии ровнее  4) карта: зум + Астория');
console.log('Если всё ок: npm run build && git add -A && git commit -m "Правки пакета 99" && git push');