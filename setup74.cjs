const fs = require('fs');
const path = require('path');

const h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const lines = h.split('\n');

console.log('========== useState в Holding ==========');
lines.forEach((l, i) => { if (l.includes('useState')) console.log(i + 1, ':', l.trim()); });

const idx = h.indexOf('fixed inset-0');
console.log('\nfixed inset-0 на символе', idx);
if (idx !== -1) {
  const ln = h.slice(0, idx).split('\n').length;
  console.log('========== Holding.tsx, строки ' + Math.max(0, ln - 15) + '-' + Math.min(lines.length, ln + 110) + ' ==========');
  console.log(lines.slice(Math.max(0, ln - 15), Math.min(lines.length, ln + 110)).join('\n'));
}

console.log('\n✅ Пришлите скрин вывода');