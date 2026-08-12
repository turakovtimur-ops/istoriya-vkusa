const fs = require('fs');
const path = require('path');

function walk(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(path.join(__dirname, 'src'));

// 1) Кто перебивает title?
console.log('========== TITLE ==========');
for (const p of files) {
  const t = fs.readFileSync(p, 'utf-8');
  if (t.includes('document.title')) {
    console.log('НАЙДЕНО в:', p);
    t.split('\n').forEach((l, i) => { if (l.includes('document.title')) console.log(i + 1, ':', l.trim()); });
  }
}

// 2) Орбиты
for (const f of ['VacanciesOrbit.tsx', 'SuppliersOrbit.tsx']) {
  const p = path.join(__dirname, 'src', 'components', f);
  console.log('\n========== ' + f + ' ==========');
  if (fs.existsSync(p)) console.log(fs.readFileSync(p, 'utf-8'));
  else console.log('не найден');
}

// 3) Контакты
const cf = files.find((p) => fs.readFileSync(p, 'utf-8').includes('Мы на карте'));
console.log('\n========== КОНТАКТЫ: ' + (cf ? path.basename(cf) : 'НЕ НАЙДЕНЫ') + ' ==========');
if (cf) console.log(fs.readFileSync(cf, 'utf-8'));

console.log('\n✅ setup55 ничего не менял. Пришлите скрины терминала!');