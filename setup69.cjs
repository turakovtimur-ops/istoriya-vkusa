const fs = require('fs');
const path = require('path');

const files = ['Hero.tsx', 'About.tsx', 'Header.tsx'];
for (const f of files) {
  const p = path.join(__dirname, 'src', 'components', f);
  console.log('\n========== ' + f + ' (' + fs.readFileSync(p, 'utf-8').split('\n').length + ' строк) ==========');
  console.log(fs.readFileSync(p, 'utf-8'));
}

console.log('\n✅ Пришлите скрины — выберу оптимальный путь');