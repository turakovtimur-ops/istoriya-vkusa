const fs = require('fs');
const path = require('path');

// ---------- HOLDING ----------
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// 1) Вакансии: орбита видна на мобиле (надёжный поиск)
const vi = h.indexOf('<VacanciesOrbit');
if (vi !== -1) {
  const divStart = h.lastIndexOf('<div className="', vi);
  const divEnd = h.indexOf('">', divStart);
  const tag = h.slice(divStart, divEnd);
  if (tag.includes('hidden lg:block')) {
    h = h.slice(0, divStart) + tag.replace('hidden lg:block', 'relative') + h.slice(divStart + tag.length);
    console.log('✓ вакансии: орбита видна на мобиле');
  } else console.log('✓ вакансии: уже видно');
} else console.warn('⚠ VacanciesOrbit не найден');

// 2) Шапка: прятать через top, НЕ через transform
const badLine = "if (el) el.style.transform = y > lastY && y > 240 ? 'translateY(-130%)' : 'translateY(0)';";
const goodLine = "if (el) el.style.top = y > lastY && y > 240 ? '-140px' : '';";
if (h.includes(badLine)) { h = h.replace(badLine, goodLine); console.log('✓ шапка: прячется через top (центрирование не ломается)'); }
else if (h.includes(goodLine)) console.log('✓ шапка: уже исправлено');
else console.warn('⚠ строка прятания шапки не найдена');

// 3) Меню компактнее
if (h.includes('py-2.5 text-2xl font-semibold tracking-tight text-cream/90 border-b border-cream/5')) {
  h = h.replace('py-2.5 text-2xl font-semibold', 'py-2 text-xl font-semibold');
  console.log('✓ меню: text-xl py-2');
} else console.warn('⚠ классы меню не найдены');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// ---------- SUPPLIERS BLOCK: надёжно ----------
let sb = fs.readFileSync(path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx'), 'utf-8');
const si = sb.indexOf('<SuppliersOrbit');
if (si !== -1) {
  const ds = sb.lastIndexOf('<div className="', si);
  const de = sb.indexOf('">', ds);
  const tag = sb.slice(ds, de);
  if (tag.includes('hidden lg:block')) {
    sb = sb.slice(0, ds) + tag.replace('hidden lg:block ', '') + sb.slice(ds + tag.length);
    console.log('✓ поставщики: орбита видна на мобиле');
  } else console.log('✓ поставщики: орбита уже видна');
}
const tape = 'className="lg:hidden overflow-hidden reveal reveal-delay-1 cursor-grab active:cursor-grabbing select-none"';
if (sb.includes(tape)) { sb = sb.replace(tape, 'className="hidden"'); console.log('✓ поставщики: лента скрыта'); }
else if (sb.includes('className="hidden"')) console.log('✓ поставщики: лента уже скрыта');
else console.warn('⚠ лента не найдена');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx'), sb, 'utf-8');

// ---------- CSS: transition для top шапки ----------
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
if (css.includes('setup82')) {
  console.log('✓ CSS setup82 уже есть');
} else {
  fs.appendFileSync(path.join(__dirname, 'src', 'index.css'), `
/* ===== setup82 ===== */
@media (max-width: 1023px) {
  header { transition: top .4s ease, transform .4s ease; }
}
`);
  console.log('✓ CSS setup82');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Мобайл финал: орбиты видимы, шапка не уплывает" && git push');