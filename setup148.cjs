const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const cFile = 'src/components/ContactsSection.tsx';
if (!fs.existsSync(P(cFile))) { console.log('⚠ нет ContactsSection.tsx — пришли файл целиком'); process.exit(0); }
const c = fs.readFileSync(P(cFile), 'utf-8');

const ids = ['kinza', 'nino', 'astoria', 'la-costa'];
const geo = {};
ids.forEach((id) => {
  const a1 = c.indexOf("'" + id + "'");
  const a2 = c.indexOf('"' + id + '"');
  const start = a1 > -1 ? a1 : a2;
  if (start === -1) return;
  const seg = c.slice(start, start + 300);
  const lat = seg.match(/44\.\d+/);
  const lon = seg.match(/38\.\d+/);
  if (lat && lon) geo[id] = [parseFloat(lon[0]), parseFloat(lat[0])];
});
console.log('Координаты с главной: ' + JSON.stringify(geo));

if (Object.keys(geo).length === 4) {
  let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
  const re = /const GEO: Record<string, \[number, number\]> = \{[\s\S]*?\};/;
  const block = 'const GEO: Record<string, [number, number]> = {\n' +
    ids.map((id) => '  ' + (id === 'la-costa' ? "'la-costa'" : id) + ': [' + geo[id][0] + ', ' + geo[id][1] + '],').join('\n') +
    '\n};';
  if (re.test(rp)) {
    rp = rp.replace(re, block);
    fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');
    console.log('✓ GEO в RestaurantPage заменён на координаты главной');
  } else console.log('⚠ блок GEO не найден в RestaurantPage');
} else {
  console.log('⚠ найдено не все 4 — пришли ContactsSection.tsx целиком');
}

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Карты: координаты Астории как на главной"');
console.log('git pull --rebase');
console.log('git push');