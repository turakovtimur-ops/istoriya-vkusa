const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Бургер: нормальная круглая иконка =================
const NEW_IMG = '<img src={holdingBrand.roundLogo} alt="История Вкуса" className="w-10 h-10 rounded-full object-cover" />';
const fixBurger = (file) => {
  if (!fs.existsSync(P(file))) return false;
  let s = fs.readFileSync(P(file), 'utf-8');
  const xi = s.indexOf('✕');
  if (xi === -1) return false;
  const start = Math.max(0, xi - 1200);
  const seg = s.slice(start, xi);
  const re = /<img[^>]*>/g;
  let m, last = null;
  while ((m = re.exec(seg)) !== null) last = m;
  if (!last) return false;
  s = s.slice(0, start + last.index) + NEW_IMG + s.slice(start + last.index + last[0].length);
  fs.writeFileSync(P(file), s, 'utf-8');
  return true;
};
let done = fixBurger('src/components/MobileNav.tsx');
if (done) console.log('✓ бургер: иконка заменена (MobileNav.tsx)');
if (!done) { done = fixBurger('src/pages/Holding.tsx'); if (done) console.log('✓ бургер: иконка заменена (Holding.tsx)'); }
if (!done) console.log('⚠ бургер не найден — пришли файл с бургер-меню');

// ================= 2) Команда: текст шире + круги не внахлёст =================
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup139')) {
  css += `
/* ===== setup139: мобилка — команда дышит ===== */
@media (max-width: 767px) {
  #team p { max-width: 340px !important; margin-left: auto !important; margin-right: auto !important; }
  #team [class*="rounded-full"] { margin-left: 6px !important; margin-right: 6px !important; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: команда — текст шире, круги с зазором');
}

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: иконка бургера + команда дышит"');
console.log('git pull --rebase');
console.log('git push');