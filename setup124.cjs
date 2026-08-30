const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);
const del = (f) => { if (fs.existsSync(P(f))) { fs.rmSync(P(f), { recursive: true, force: true }); return true; } return false; };

// ================= 1) .DS_Store =================
let d = 0;
['public/.DS_Store', 'public/images/.DS_Store', 'public/images/holding/.DS_Store', 'public/images/kinza/.DS_Store', 'public/images/la-costa/.DS_Store', 'public/images/nino/.DS_Store', 'public/images/partners/.DS_Store'].forEach((f) => { if (del(f)) d++; });
console.log('✓ .DS_Store удалено: ' + d);
let gi = fs.readFileSync(P('.gitignore'), 'utf-8');
if (!gi.includes('.DS_Store')) { fs.writeFileSync(P('.gitignore'), gi + '\n.DS_Store\n', 'utf-8'); console.log('✓ .gitignore: +.DS_Store'); }

// ================= 2) одноразовые setup'ы =================
let s = 0;
for (let i = 93; i <= 123; i++) {
  if (i === 120) continue; // живой генератор плакатов
  if (del('setup' + i + '.cjs')) s++;
}
console.log('✓ setup-хлам удалён: ' + s + ' (setup120 оставлен)');

// ================= 3) живой инструмент для будущих галерей =================
fs.writeFileSync(P('refresh-gallery.cjs'), `const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);
const re = P('src/data/resto-extra.ts');
let txt = fs.readFileSync(re, 'utf-8');
const i0 = txt.indexOf('= {'); const i1 = txt.lastIndexOf('};');
const data = JSON.parse(txt.slice(i0 + 2, i1 + 1));
for (const id of Object.keys(data)) {
  const dir = P('public/images/' + id + '/gallery');
  data[id].gallery = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /\\.(jpe?g|png|webp)$/i.test(f)).sort().map((f) => '/images/' + id + '/gallery/' + f)
    : [];
  console.log(id + ': ' + data[id].gallery.length + ' фото');
}
fs.writeFileSync(re, txt.slice(0, i0 + 2) + JSON.stringify(data, null, 2) + txt.slice(i1 + 1), 'utf-8');
console.log('✓ галереи обновлены (темы и рейтинги сохранены). Дальше: npm run build && пуш');
`, 'utf-8');
console.log('✓ refresh-gallery.cjs создан (запускать, когда добавишь фото в gallery/)');

// ================= 4) мёртвый код (с предохранителем) =================
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const srcAll = walk(P('src')).filter((f) => /\.(tsx?|css)$/.test(f)).map((f) => fs.readFileSync(f, 'utf-8')).join('\n');
const used = (name) => new RegExp("['\"/]" + name + "['\"]').test(srcAll);
const dead = ['AstoriaSite', 'LaCostaSite', 'NinoSite', 'KinzaSite_old', 'RestaurantStub', 'About', 'Banquets', 'Contact', 'Footer', 'Header', 'Hero', 'MenuSection', 'MobileNav', 'Gallery', 'Reviews', 'SeaBlock', 'CinematicRestaurants', 'RestaurantGallery', 'SuppliersOrbit', 'UniversalRestaurantSite'];
let k = 0;
dead.forEach((n) => {
  const file = ['AstoriaSite', 'LaCostaSite', 'NinoSite', 'KinzaSite_old'].includes(n) ? 'src/sites/' + n + '.tsx'
    : n === 'RestaurantStub' ? 'src/pages/' + n + '.tsx' : 'src/components/' + n + '.tsx';
  if (!fs.existsSync(P(file))) return;
  if (used(n)) { console.log('ℹ ' + n + ' — используется, оставлен'); return; }
  del(file); k++;
});
console.log('✓ мёртвых компонентов удалено: ' + k);

// ================= 5) фото ресторанов → в корзину =================
let ph = 0;
['public/images/astoria/astoria-photo.jpg', 'public/images/kinza/kinza-photo.jpeg', 'public/images/la-costa/la-costa-photo.jpeg', 'public/images/nino/nino-photo.jpg'].forEach((f) => { if (del(f)) ph++; });
console.log('✓ фото ресторанов удалено: ' + ph + ' (лого/иконки/паттерны не тронуты)');

// ================= 6) заглушки вместо фото на страницах ресторанов =================
let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const r0 = rp;
// хиро
rp = rp.replace('<img src={restaurant.image} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover kenburns" />',
  '<div className="absolute inset-0" style={{ background: \'radial-gradient(circle at 50% 35%, \' + accent + \'45, #100e0c 78%)\' }} />\n          <div className="absolute inset-0 flex items-center justify-center"><img src={restaurant.logo} alt="" className="h-28 w-auto object-contain opacity-30" /></div>');
// о ресторане
rp = rp.replace('<img src={gallery[0]} alt={restaurant.name + \' — ресторан в Геленджике\'} className="w-full h-full object-cover" />',
  '<div className="w-full h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed" style={{ borderColor: accent + \'66\', background: accent + \'10\' }}><img src={restaurant.logo} alt="" className="h-14 w-auto object-contain opacity-50" /><p className={\'text-xs uppercase tracking-[0.3em] \' + cMute}>Фото скоро</p></div>');
// банкеты
rp = rp.replace('<img src={gallery[1] || gallery[0]} alt={\'Банкеты в \' + restaurant.name} className="w-full h-full object-cover" />',
  '<div className="w-full h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed" style={{ borderColor: accent + \'66\', background: accent + \'10\' }}><img src={restaurant.logo} alt="" className="h-14 w-auto object-contain opacity-50" /><p className={\'text-xs uppercase tracking-[0.3em] \' + cMute}>Фото скоро</p></div>');
// галерея: пусто → пунктирные плитки
const galOld = "{gallery.map((src, i) => (\n              <div key={i} className=\"aspect-[4/3] rounded-lg overflow-hidden shadow-lg group\">\n                <img loading=\"lazy\" src={src} alt={restaurant.name + ' — фото ' + (i + 1)} className=\"w-full h-full object-cover group-hover:scale-110 transition-transform duration-500\" />\n              </div>\n            ))}";
const galNew = "{extra.gallery.length > 0 ? gallery.map((src, i) => (\n              <div key={i} className=\"aspect-[4/3] rounded-lg overflow-hidden shadow-lg group\">\n                <img loading=\"lazy\" src={src} alt={restaurant.name + ' — фото ' + (i + 1)} className=\"w-full h-full object-cover group-hover:scale-110 transition-transform duration-500\" />\n              </div>\n            )) : Array.from({ length: 6 }).map((_, i) => (\n              <div key={i} className=\"aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3\" style={{ borderColor: accent + '55', background: accent + '0d' }}>\n                <img src={restaurant.logo} alt=\"\" className=\"h-10 w-auto object-contain opacity-40\" />\n                <p className={'text-[10px] uppercase tracking-[0.3em] ' + cMute}>Фото скоро</p>\n              </div>\n            ))}";
if (rp.includes(galOld)) rp = rp.split(galOld).join(galNew);
if (rp !== r0) { fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8'); console.log('✓ заглушки «Фото скоро» на страницах ресторанов'); }
else console.log('⚠ заглушки: строки не найдены — проверь вручную');

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Чистка проекта + заглушки фото" && git push');
console.log('ℹ Когда подготовишь фото: положи в public/images/{id}/gallery/ → node refresh-gallery.cjs → build → пуш');