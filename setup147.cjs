const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const rp0 = rp;

// 1) координаты ресторанов (долгота, широта) + хелпер
const h2c = "const H2C = 'text-4xl md:text-6xl font-semibold tracking-tighter';";
const geoBlock = h2c + `
const GEO: Record<string, [number, number]> = {
  kinza: [38.068116, 44.555321],
  nino: [38.065023, 44.555225],
  astoria: [38.064269, 44.555733],
  'la-costa': [38.076432, 44.558886],
};
const geo = (id: string) => GEO[id] || [38.0776, 44.5611];`;
if (rp.includes(h2c) && !rp.includes('const GEO')) rp = rp.split(h2c).join(geoBlock);

// 2) iframe: вместо text= — координаты + метка
const re = /src=\{'https:\/\/yandex\.ru\/map-widget\/v1\/\?text='[\s\S]*?'&z=16'\}/;
if (re.test(rp)) {
  rp = rp.replace(re, "src={'https://yandex.ru/map-widget/v1/?ll=' + geo(restaurant.id).join(',') + '&z=16&pt=' + geo(restaurant.id).join(',') + ',pm2rdm'}");
  console.log('✓ карты ресторанов: чистая карта с красной меткой, без баллона');
} else console.log('⚠ iframe карты не найден');

if (rp !== rp0) fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Карты ресторанов: метки по координатам"');
console.log('git pull --rebase');
console.log('git push');