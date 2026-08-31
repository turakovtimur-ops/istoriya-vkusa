const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const rp0 = rp;

const NEW_GEO = `const GEO: Record<string, [number, number]> = {
  kinza: [38.0687, 44.5551],
  nino: [38.065, 44.5552],
  astoria: [38.063362, 44.555713],
  'la-costa': [38.07625, 44.559098],
};`;

const re = /const GEO: Record<string, \[number, number\]> = \{[\s\S]*?\};/;
if (re.test(rp)) {
  rp = rp.replace(re, NEW_GEO);
  fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');
  console.log('✓ GEO = координаты главной страницы (Кинза, Астория, Ла Коста исправлены)');
} else console.log('⚠ блок GEO не найден — пришли RestaurantPage.tsx');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Карты: координаты как на главной"');
console.log('git pull --rebase');
console.log('git push');