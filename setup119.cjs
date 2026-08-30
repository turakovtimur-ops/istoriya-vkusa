const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const STARS_CONST = "const STARS = Array.from({ length: 70 }, () => ({ top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 4 }));";

// ================= Holding.tsx =================
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
let n = 0;

// 1) футер: компактнее
if (h.includes('className="h-24 lg:h-28 w-auto object-contain"')) {
  h = h.split('className="h-24 lg:h-28 w-auto object-contain"').join('className="h-14 lg:h-16 w-auto object-contain"');
  h = h.split('text-cream/50 text-sm font-light mt-5').join('text-cream/50 text-sm font-light mt-3');
  n++; console.log('✓ футер: логотип уменьшен, блок компактный');
}

// 2) скролл: не кидать наверх при обновлении
const scrollOld = "if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';\n    window.scrollTo(0, 0);";
const scrollNew = "if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'auto';";
if (h.includes(scrollOld)) {
  h = h.split(scrollOld).join(scrollNew);
  n++; console.log('✓ обновление страницы: остаёмся на месте скролла');
}

// 3) звёзды в вакансиях
if (!h.includes('STARS')) {
  h = h.replace("import { useScrollAnimation } from '../hooks/useScrollAnimation';",
    "import { useScrollAnimation } from '../hooks/useScrollAnimation';\n" + STARS_CONST);
  const vacOld = '<section id="vacancies" className="pt-16 lg:pt-24 pb-8 lg:pb-10">';
  const vacNew = '<section id="vacancies" className="relative overflow-hidden pt-16 lg:pt-24 pb-8 lg:pb-10">\n      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">{STARS.map((s, i) => (<span key={i} className="absolute rounded-full bg-cream/60 star-twinkle" style={{ top: s.top + \'%\', left: s.left + \'%\', width: s.size, height: s.size, animationDelay: s.delay + \'s\' }} />))}</div>';
  if (h.includes(vacOld)) {
    h = h.split(vacOld).join(vacNew);
    h = h.split('<div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14 items-center">').join('<div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14 items-center">');
    n++; console.log('✓ звёзды в «Вакансии»');
  }
}
if (n) fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

// ================= SuppliersBlock.tsx: звёзды =================
const sf = P('src/components/SuppliersBlock.tsx');
let sb = fs.readFileSync(sf, 'utf-8');
if (!sb.includes('STARS')) {
  sb = sb.replace('export default', STARS_CONST.replace('{ length: 70 }', '{ length: 60 }') + '\n\nexport default');
  const mSec = sb.match(/<section\b[^>]*>/);
  if (mSec) {
    let tag = mSec[0];
    if (tag.includes('className="')) tag = tag.replace('className="', 'className="relative overflow-hidden ');
    else tag = tag.replace('>', ' className="relative overflow-hidden">');
    const starsJsx = tag + '\n      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">{STARS.map((s, i) => (<span key={i} className="absolute rounded-full bg-cream/50 star-twinkle" style={{ top: s.top + \'%\', left: s.left + \'%\', width: s.size, height: s.size, animationDelay: s.delay + \'s\' }} />))}</div>';
    sb = sb.replace(mSec[0], starsJsx);
    fs.writeFileSync(sf, sb, 'utf-8');
    console.log('✓ звёзды в «Поставщики»');
  } else console.log('⚠ SuppliersBlock: section не найден');
} else console.log('ℹ SuppliersBlock: звёзды уже есть');

// ================= RestaurantPage: не кидать наверх при обновлении =================
const rf = P('src/sites/RestaurantPage.tsx');
let rp = fs.readFileSync(rf, 'utf-8');
const rpOld = 'useEffect(() => { window.scrollTo(0, 0); }, []);';
if (rp.includes(rpOld)) {
  rp = rp.split(rpOld).join('');
  fs.writeFileSync(rf, rp, 'utf-8');
  console.log('✓ страницы ресторанов: при обновлении остаёмся на месте');
}

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Футер компакт + скролл-память + звёзды в вакансиях и поставщиках" && git push');