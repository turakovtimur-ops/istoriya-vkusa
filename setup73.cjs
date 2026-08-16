const fs = require('fs');
const path = require('path');

const h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const lines = h.split('\n');

let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('mobileOpen') || lines[i].includes('MobileOpen')) { start = i; break; }
}
console.log('mobileOpen найден на строке', start);
if (start !== -1) {
  console.log('========== Holding.tsx, строки ' + Math.max(0, start - 10) + '-' + Math.min(lines.length, start + 90) + ' ==========');
  console.log(lines.slice(Math.max(0, start - 10), Math.min(lines.length, start + 90)).join('\n'));
}

// на всякий случай — MobileNav отдельным файлом?
const mn = path.join(__dirname, 'src', 'components', 'MobileNav.tsx');
if (fs.existsSync(mn)) {
  console.log('\n========== MobileNav.tsx ==========');
  console.log(fs.readFileSync(mn, 'utf-8'));
}

console.log('\n✅ Пришлите скрин вывода');