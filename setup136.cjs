const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup136')) {
  css += `
/* ===== setup136: мобилка — фото без белых полей + орбиты вместо карточек ===== */
@media (max-width: 767px) {
  /* фото ресторанов растянуты, без белых пустот */
  #restaurants .hv-carousel-r img, .hv-carousel-r img, #restaurants img {
    object-fit: cover !important;
    padding: 0 !important;
    width: 100% !important;
    height: 220px !important;
    background: transparent !important;
  }
  #restaurants [class*="hv-carousel-r"] > * { background: #141210 !important; }
}
@media (max-width: 1023px) {
  /* орбита поставщиков на мобилке вместо карточек */
  #suppliers [class*="lg:block"] { display: block !important; }
  #suppliers [class*="lg:hidden"] { display: none !important; }
  /* орбита вакансий на мобилке вместо столбика */
  #vacancies [class*="lg:block"] { display: block !important; }
  #vacancies [class*="lg:hidden"] { display: none !important; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: фото cover + орбиты на мобилке');
} else console.log('ℹ setup136 уже в css');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: фото cover + орбиты вакансий/поставщиков"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n↩️ Откат: git revert HEAD --no-edit && git push');