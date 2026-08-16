const fs = require('fs');
const path = require('path');

// ---------- 1) CSS: срезаем все мобильные хаки, оставляем чистую адаптивность ----------
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
const cutIdx = css.indexOf('/* ===== setup61');
if (cutIdx !== -1) {
  css = css.slice(0, cutIdx);
  console.log('✓ CSS: мобильные хаки удалены');
} else console.warn('⚠ setup61-блок не найден в CSS');

css += `
/* ===== mobile reset: простая адаптивность ===== */
html, body { overflow-x: clip; }
#root { max-width: 100vw; }
.team-anim { animation: teamIn .45s ease; }
@keyframes teamIn { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: none; } }
@media (max-width: 1023px) {
  header { transition: top .4s ease, transform .4s ease; }
}
@media (max-width: 767px) {
  /* логотипы ресторанов не растягиваются в белый квадрат */
  #restaurants img { display: none; }
  #restaurants .reveal { opacity: 1 !important; transform: none !important; }
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'index.css'), css, 'utf-8');
console.log('✓ CSS: чистая адаптивность');

// ---------- 2) Вакансии: на мобиле плашки (адаптивно), орбита только десктоп ----------
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const vi = h.indexOf('<VacanciesOrbit');
if (vi !== -1) {
  const ds = h.lastIndexOf('<div className="', vi);
  const de = h.indexOf('">', ds);
  const tag = h.slice(ds, de);
  if (!tag.includes('hidden lg:block')) {
    h = h.slice(0, ds) + tag.replace('relative', 'hidden lg:block') + h.slice(ds + tag.length);
    console.log('✓ вакансии: орбита только десктоп');
  }
}
h = h.replace('<div className="hidden">\n              {vacancies.map((v) => (', '<div className="flex flex-wrap gap-3 lg:hidden mt-2">\n              {vacancies.map((v) => (');
if (h.includes('flex flex-wrap gap-3 lg:hidden mt-2')) console.log('✓ вакансии: плашки на мобиле');
else console.warn('⚠ плашки вакансий не найдены');
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// ---------- 3) Поставщики: орбита только десктоп, на мобиле лента ----------
let sb = fs.readFileSync(path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx'), 'utf-8');
const si = sb.indexOf('<SuppliersOrbit');
if (si !== -1) {
  const ds = sb.lastIndexOf('<div className="', si);
  const de = sb.indexOf('">', ds);
  const tag = sb.slice(ds, de);
  if (!tag.includes('hidden lg:block')) {
    sb = sb.slice(0, ds) + 'div className="hidden lg:block reveal reveal-delay-1 mb-6' + sb.slice(de);
    console.log('✓ поставщики: орбита только десктоп');
  }
}
if (sb.includes('className="hidden"')) {
  sb = sb.replace('className="hidden"', 'className="lg:hidden overflow-hidden reveal reveal-delay-1 cursor-grab active:cursor-grabbing select-none"');
  console.log('✓ поставщики: лента на мобиле');
}
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx'), sb, 'utf-8');

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Мобайл: простая адаптивность" && git push');