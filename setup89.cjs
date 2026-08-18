const fs = require('fs');
const path = require('path');

const k = path.join(__dirname, 'src', 'sites', 'KinzaSite.tsx');
if (fs.existsSync(k)) {
  const code = fs.readFileSync(k, 'utf-8');
  console.log('===== KinzaSite.tsx (' + code.split('\n').length + ' строк) =====');
  console.log(code);
} else {
  console.warn('⚠ KinzaSite.tsx не найден, ищу другие файлы:');
  console.log(fs.readdirSync(path.join(__dirname, 'src', 'sites')).join('\n'));
  console.log(fs.readdirSync(path.join(__dirname, 'src', 'components')).join('\n'));
}

console.log('\n===== данные ресторанов (holding.ts, первые 120 строк) =====');
const h = fs.readFileSync(path.join(__dirname, 'src', 'data', 'holding.ts'), 'utf-8');
console.log(h.split('\n').slice(0, 120).join('\n'));

console.log('\n===== файлы в public/images =====');
function walk(dir, base, out) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const rel = (base ? base + '/' : '') + f;
    if (fs.statSync(p).isDirectory()) { if (rel.split('/').length <= 3) walk(p, rel, out); }
    else out.push(rel);
  }
  return out;
}
console.log(walk(path.join(__dirname, 'public', 'images'), '', []).join('\n') || '(пусто)');

console.log('\n✅ Пришлите скрин вывода (если длинный — несколько)');