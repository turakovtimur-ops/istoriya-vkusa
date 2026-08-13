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

const kinza = files.filter((p) => fs.readFileSync(p, 'utf-8').includes('ЗАБРОНИРОВАТЬ'));
const stub = files.filter((p) => fs.readFileSync(p, 'utf-8').includes('Вернуться в холдинг'));

console.log('Файл(ы) страницы Кинзы:', kinza);
console.log('Файл(ы) заглушек:', stub);

if (kinza[0]) {
  console.log('\n========== КИНЗА: ' + path.basename(kinza[0]) + ' (первые 220 строк) ==========');
  console.log(fs.readFileSync(kinza[0], 'utf-8').split('\n').slice(0, 220).join('\n'));
}
if (stub[0] && stub[0] !== kinza[0]) {
  console.log('\n========== ЗАГЛУШКА: ' + path.basename(stub[0]) + ' (первые 120 строк) ==========');
  console.log(fs.readFileSync(stub[0], 'utf-8').split('\n').slice(0, 120).join('\n'));
}

console.log('\n✅ Пришлите скрины вывода — и я соберу 3 страницы по образцу Кинзы');