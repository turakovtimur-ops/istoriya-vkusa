const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let oh = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const oh0 = oh;

// 1) спускаем блок надписей от шапки (мобилка)
oh = oh.split("'lg:min-h-screen flex flex-col pt-24 pb-4'")
  .join("'lg:min-h-screen flex flex-col pt-32 pb-4'");

// 2) заголовок в одну строку
oh = oh.split('<p className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-cream">Одна история —<br className="md:hidden" /> четыре вкуса</p>')
  .join('<p className="text-[min(6vw,30px)] md:text-5xl lg:text-6xl font-semibold tracking-tighter text-cream whitespace-nowrap">Одна история — четыре вкуса</p>');

// 3) подзаголовок в одну строку
oh = oh.split('<p className="text-cream/60 font-light text-base md:text-xl mt-4">Ты непременно станешь частью нашей истории</p>')
  .join('<p className="text-cream/60 font-light text-[min(3.9vw,18px)] md:text-xl mt-4 whitespace-nowrap">Ты непременно станешь частью нашей истории</p>');

if (oh !== oh0) {
  fs.writeFileSync(P('src/components/OrbitHero.tsx'), oh, 'utf-8');
  console.log('✓ надписи: по одной строке + блок спущен от шапки');
} else console.log('⚠ строки не найдены');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: надписи в одну строку, отступ от шапки"');
console.log('git pull --rebase');
console.log('git push');