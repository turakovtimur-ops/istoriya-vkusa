const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) ВАКАНСИИ: на мобиле список вместо орбиты =================
let holding = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const h0 = holding;
holding = holding.replace('<div className="block -mt-4 lg:-mt-8">', '<div className="hidden md:block -mt-4 lg:-mt-8">');
holding = holding.replace('<div className="hidden">', '<div className="md:hidden flex flex-col gap-3">');
if (holding !== h0) {
  fs.writeFileSync(P('src/pages/Holding.tsx'), holding, 'utf-8');
  console.log('✓ вакансии: мобайл = список, веб = орбита');
} else console.log('⚠ вакансии: строки не найдены');

// ================= 2) Текст «наведите мышь» → «листайте» =================
for (const f of ['src/components/SuppliersBlock.tsx', 'src/pages/Holding.tsx']) {
  let s = fs.readFileSync(P(f), 'utf-8');
  if (s.includes('наведите мышь')) {
    s = s.replace('наведите мышь, чтобы остановить и рассмотреть', 'листайте, чтобы рассмотреть');
    s = s.replace('наведите мышь', 'листайте');
    fs.writeFileSync(P(f), s, 'utf-8');
    console.log('✓ текст «наведите мышь» заменён (' + f + ')');
  }
}

// ================= 3) Мобильный CSS =================
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('/* setup105 */')) {
  css += `
/* setup105 */
@media (max-width:767px){
  /* Акции / Мероприятия / Поставщики — вертикальный столбик */
  #promos .grid, #events .grid, #events [class*="grid"], #suppliers .grid, #suppliers [class*="grid"] {
    display: grid !important;
    grid-template-columns: 1fr !important;
    overflow-x: visible !important;
    flex-direction: column !important;
  }
  #promos .grid > *, #events .grid > *, #events [class*="grid"] > *, #suppliers .grid > *, #suppliers [class*="grid"] > * {
    min-width: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
  }
  /* Карусели: боковые отступы, карточки не вплотную */
  .hv-carousel { margin: 0 !important; padding: 4px 20px 16px !important; }
  .hv-carousel > * { min-width: 86% !important; max-width: 86% !important; }
  /* Фото ресторанов на весь блок */
  .hv-carousel-r img { width: 100% !important; height: 100% !important; object-fit: cover !important; padding: 0 !important; }
  .hv-carousel-p img { width: 100% !important; height: 100% !important; object-fit: cover !important; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ мобильный CSS: столбики + отступы + фото cover');
}

// ================= 4) Орбита: вывод кода подписей (если дубли останутся) =================
const oh = P('src/components/OrbitHero.tsx');
if (fs.existsSync(oh)) {
  const t = fs.readFileSync(oh, 'utf-8');
  const nameCount = (t.match(/\{[a-z]+\.name\}/g) || []).length;
  console.log('ℹ OrbitHero: вхождений {X.name} = ' + nameCount);
  if (nameCount > 2) {
    console.log('--- фрагмент OrbitHero (подписи) ---');
    const i = t.indexOf('name');
    console.log(t.slice(Math.max(0, i - 600), i + 900));
  }
}

console.log('\n✅ Обнови localhost:5173 в режиме мобилы (DevTools → телефон) и проверь:');
console.log('   1) Акции и Мероприятия — карточки столбиком, ничего не режется');
console.log('   2) Вакансии — список кнопок вместо слипшейся орбиты');
console.log('   3) Четыре характера — фото на весь блок, карточки с отступами');
console.log('   4) Партнёры/поставщики — не прилипают к краю');