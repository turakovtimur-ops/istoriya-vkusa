const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let oh = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const oh0 = oh;
oh = oh.split('>Одна история — четыре вкуса</p>')
  .join('>Одна история —<br className="md:hidden" /> четыре вкуса</p>');
if (oh !== oh0) {
  fs.writeFileSync(P('src/components/OrbitHero.tsx'), oh, 'utf-8');
  console.log('✓ заголовок: на мобилке «Одна история — / четыре вкуса», на вебе одна строка');
} else console.log('⚠ заголовок не найден');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: красивый перенос заголовка"');
console.log('git pull --rebase');
console.log('git push');