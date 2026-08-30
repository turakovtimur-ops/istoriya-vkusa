const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let s = fs.readFileSync(P('src/data/suppliers.ts'), 'utf-8');
const s0 = s;
// 1) двойная запятая
s = s.split("'#C2A076',,").join("'#C2A076',");
// 2) поле image → logo (орбита читает logo)
s = s.split("image: '/images/suppliers/admgel.png'").join("logo: '/images/suppliers/admgel.png',");
if (s !== s0) {
  fs.writeFileSync(P('src/data/suppliers.ts'), s, 'utf-8');
  console.log('✓ suppliers.ts: запятая фикс + герб в поле logo');
} else {
  console.log('⚠ нечего чинить — пришли файл');
}
console.log('\nДальше СТРОГО по порядку:');
console.log('npm run build');
console.log('git add -A && git commit -m "Администрация: герб на орбите"');
console.log('git pull --rebase');
console.log('git push');