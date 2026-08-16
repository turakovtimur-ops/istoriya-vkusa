const fs = require('fs');
const path = require('path');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('⚠ не найдено:', label); return src; }
  console.log('✓', label);
  return src.replace(from, to);
}

// ---------- HOLDING ----------
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
h = rep(h, 'className="hidden lg:block">\n            <VacanciesOrbit', 'className="relative">\n            <VacanciesOrbit', 'вакансии: орбита видна на мобиле');
h = rep(h, 'className="hidden lg:block lg:hidden flex flex-wrap gap-3"', 'className="hidden"', 'вакансии: плашки-дубли скрыты');
h = rep(h, 'py-3.5 text-3xl', 'py-2.5 text-2xl', 'меню компактнее');
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// ---------- SUPPLIERS BLOCK ----------
let sb = fs.readFileSync(path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx'), 'utf-8');
sb = rep(sb, 'className="hidden lg:block reveal reveal-delay-1 mb-6"', 'className="reveal reveal-delay-1 mb-6"', 'поставщики: орбита видна на мобиле');
sb = rep(sb, 'className="lg:hidden overflow-hidden reveal reveal-delay-1 cursor-grab active:cursor-grabbing select-none"', 'className="hidden"', 'поставщики: лента скрыта на мобиле');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx'), sb, 'utf-8');

// ---------- ОРБИТЫ: компактнее, не вылезают за экран ----------
let oh = fs.readFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), 'utf-8');
oh = rep(oh, 'setMobileR(Math.min(w * 0.42, 190));', 'setMobileR(Math.min(w * 0.36, 170));', 'главная орбита: радиус мобайла');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), oh, 'utf-8');

for (const f of ['VacanciesOrbit.tsx', 'SuppliersOrbit.tsx']) {
  let o = fs.readFileSync(path.join(__dirname, 'src', 'components', f), 'utf-8');
  o = rep(o, '* 0.38, 190)', '* 0.36, 170)', f + ': радиус 0.36/170');
  o = rep(o, '* 0.38)', '* 0.36)', f + ': радиус 0.36');
  fs.writeFileSync(path.join(__dirname, 'src', 'components', f), o, 'utf-8');
}

// ---------- CSS ----------
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
if (css.includes('setup80')) {
  console.log('✓ CSS setup80 уже есть');
} else {
  fs.appendFileSync(path.join(__dirname, 'src', 'index.css'), `
/* ===== setup80 ===== */
html, body { overflow-x: hidden; max-width: 100vw; }
#root { overflow-x: clip; }
@media (max-width: 767px) {
  #restaurants img { width: 72px !important; height: 72px !important; object-fit: contain; border-radius: 9999px; }
  #promos .grid p { overflow-wrap: break-word; }
}
`);
  console.log('✓ CSS setup80: нет горизонтального скролла, лого-кружки в ресторанах');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Мобайл: орбиты видимы, нет горизонтального скролла" && git push');