const fs = require('fs');
const path = require('path');

const k = path.join(__dirname, 'src', 'sites', 'KinzaSite.tsx');
console.log('========== KinzaSite.tsx (' + fs.readFileSync(k, 'utf-8').split('\n').length + ' строк) ==========');
console.log(fs.readFileSync(k, 'utf-8'));

const s = path.join(__dirname, 'src', 'pages', 'RestaurantStub.tsx');
console.log('\n========== RestaurantStub.tsx ==========');
console.log(fs.readFileSync(s, 'utf-8'));

console.log('\n✅ Пришлите скрины терминала — и я соберу 3 новых сайта');