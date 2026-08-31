const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let app = fs.readFileSync(P('src/App.tsx'), 'utf-8');
const app0 = app;
const anchor = "const href = a.getAttribute('href') || '';";
const guard = anchor + "\n      if (a.target === '_blank' || /\\.(pdf|jpe?g|png|webp|svg|xml|txt|ico)(\\?.*)?$/i.test(href)) return;";
if (app.includes(anchor) && !app.includes("_blank' ||")) {
  app = app.split(anchor).join(guard);
  fs.writeFileSync(P('src/App.tsx'), app, 'utf-8');
  console.log('✓ App: PDF и target=_blank больше не перехватываются');
} else console.log('⚠ App: якорь не найден или охранник уже стоит');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Фикс: PDF-меню открываются в новой вкладке"');
console.log('git pull --rebase');
console.log('git push');