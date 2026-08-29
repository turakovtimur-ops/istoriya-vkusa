const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) H1: ключевой запрос для поисковика =================
// OrbitHero: видимый заголовок делаем <p>, чтобы H1 был один и с ключом
let oh = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const ohOld = '<h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-cream">Одна история — четыре вкуса</h1>';
const ohNew = '<p className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-cream">Одна история — четыре вкуса</p>';
if (oh.includes(ohOld)) {
  oh = oh.split(ohOld).join(ohNew);
  fs.writeFileSync(P('src/components/OrbitHero.tsx'), oh, 'utf-8');
  console.log('✓ OrbitHero: видимый заголовок → <p>');
} else console.log('⚠ OrbitHero: h1 не найден');

// Holding: скрытый H1 с ключевым запросом
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const hOld = '<HoldingHeader />\n      <OrbitHero />';
const hNew = '<HoldingHeader />\n      <h1 className="sr-only">История Вкуса — рестораны и отели в Геленджике</h1>\n      <OrbitHero />';
if (h.includes(hOld)) {
  h = h.split(hOld).join(hNew);
  console.log('✓ Holding: скрытый H1 добавлен');
} else console.log('⚠ Holding: точка вставки H1 не найдена');

// ================= 2) Alt у фото карточек =================
const altOld = 'alt={r.name}';
const altNew = "alt={r.name + ' — ресторан в Геленджике'}";
if (h.includes(altOld)) {
  h = h.split(altOld).join(altNew);
  console.log('✓ alt у фото карточек: «Кинза — ресторан в Геленджике»');
} else console.log('⚠ alt не найден');
fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

// ================= 3) OG-картинка: фото вместо лого =================
let html = fs.readFileSync(P('index.html'), 'utf-8');
const ogOld = '<meta property="og:image" content="https://www.istoriya-vkusa.ru/images/holding/istoriya-vkusa-logo.png" />';
const ogNew = '<meta property="og:image" content="https://www.istoriya-vkusa.ru/images/kinza/kinza-photo.jpeg" />';
if (html.includes(ogOld)) {
  html = html.split(ogOld).join(ogNew);
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ og:image → фото интерьера Кинзы');
} else console.log('⚠ og:image не найден');

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "SEO: H1, alt, og-image" && git push');