const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'components', 'OrbitHero.tsx');
console.log('========== OrbitHero.tsx ==========');
console.log(fs.readFileSync(p, 'utf-8'));
console.log('\n✅ Пришлите скрин терминала — и я соберу вакансии и поставщики точно так же');