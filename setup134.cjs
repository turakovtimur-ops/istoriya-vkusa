const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let o = fs.readFileSync(P('src/components/SuppliersOrbit.tsx'), 'utf-8');
const fixed = 'const deg = ring.phase + Math.floor(i / RINGS.length) * 180 + t * ring.speed;';
const i1 = o.indexOf(fixed);
let done = false;
if (i1 !== -1) {
  const i2 = o.indexOf(fixed, i1 + fixed.length);
  if (i2 !== -1) {
    o = o.slice(0, i2) + 'const deg = ring.phase + 90 + t * ring.speed;' + o.slice(i2 + fixed.length);
    fs.writeFileSync(P('src/components/SuppliersOrbit.tsx'), o, 'utf-8');
    done = true;
    console.log('✓ «Стать партнёром» больше не ссылается на i (+90° чтобы не толкаться)');
  }
}
if (!done) console.log('⚠ второе вхождение не найдено — пришли SuppliersOrbit.tsx');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Партнёры: фикс орбиты кнопки"');
console.log('git pull --rebase');
console.log('git push');