const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup151')) {
  css += `
/* ===== setup151: мобилка — контакты ресторанов в одну колонку, без рваных переносов ===== */
@media (max-width: 767px) {
  #contacts .grid { grid-template-columns: 1fr !important; gap: 24px !important; }
  #contacts a[href^="tel"], #contacts .whitespace-nowrap { white-space: nowrap !important; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: контакты ресторанов — одна колонка, телефоны целые');
} else console.log('ℹ setup151 уже в css');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: контакты ресторанов без рваных переносов"');
console.log('git pull --rebase');
console.log('git push');