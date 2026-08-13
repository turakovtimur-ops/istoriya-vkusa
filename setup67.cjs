const fs = require('fs');
const path = require('path');

function walk(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) out.push(p);
  }
  return out;
}

const files = walk(path.join(__dirname, 'src'));

console.log('========== ВСЕ ФАЙЛЫ src ==========');
files.forEach((p) => console.log(p.replace(__dirname + '/src/', '')));

const kinza = files.filter((p) => fs.readFileSync(p, 'utf-8').toLowerCase().includes('абронировать'));
console.log('\nСтраница Кинзы:', kinza);

if (kinza[0]) {
  const t = fs.readFileSync(kinza[0], 'utf-8');
  console.log('\n========== КИНЗА: ' + path.basename(kinza[0]) + ' (' + t.split('\n').length + ' строк) ==========');
  console.log(t.split('\n').slice(0, 260).join('\n'));
}

const router = files.filter((p) => fs.readFileSync(p, 'utf-8').includes('RestaurantStub'));
console.log('\nКто рендерит RestaurantStub:', router);
for (const p of router) {
  if (!p.includes('RestaurantStub.tsx')) {
    const t = fs.readFileSync(p, 'utf-8');
    const i = t.indexOf('RestaurantStub');
    console.log('\n========== РОУТЕР: ' + path.basename(p) + ' (вокруг RestaurantStub) ==========');
    console.log(t.split('\n').slice(Math.max(0, t.slice(0, i).split('\n').length - 30), t.slice(0, i).split('\n').length + 40).join('\n'));
  }
}

console.log('\n✅ Пришлите скрины вывода');