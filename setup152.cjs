const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const rp0 = rp;
rp = rp.split('<div className="grid grid-cols-2 gap-6">')
  .join('<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">');
if (rp !== rp0) {
  fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');
  console.log('✓ рестораны: адрес/телефон в одну колонку на мобилке');
} else console.log('⚠ блок не найден');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: адрес и телефон без рваных переносов"');
console.log('git pull --rebase');
console.log('git push');