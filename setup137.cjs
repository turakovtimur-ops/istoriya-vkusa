const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup137')) {
  css += `
/* ===== setup137: мобилка — орбита вакансий вместо столбика ===== */
@media (max-width: 1023px) {
  #vacancies .hidden { display: block !important; }
  #vacancies .md\\:hidden, #vacancies .lg\\:hidden { display: none !important; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: орбита вакансий на мобилке');
} else console.log('ℹ setup137 уже в css');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: орбита вакансий"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n↩️ Откат: git revert HEAD --no-edit && git push');