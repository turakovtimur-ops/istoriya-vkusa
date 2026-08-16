const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
console.log('CSS setup77:', css.includes('setup77'), '| setup78:', css.includes('setup78'), '| overflow-x:', css.includes('overflow-x'));

const v = fs.readFileSync(path.join(__dirname, 'src', 'components', 'VacanciesOrbit.tsx'), 'utf-8');
console.log('\nVacanciesOrbit: isMob ветка =', v.includes('if (isMob)'));

const h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const lines = h.split('\n');
const vi = lines.findIndex((l) => l.includes('<VacanciesOrbit'));
console.log('\n========== Holding вокруг VacanciesOrbit ==========');
if (vi !== -1) console.log(lines.slice(Math.max(0, vi - 12), vi + 8).join('\n'));

const si = lines.findIndex((l) => l.includes('<SuppliersBlock') || l.includes('<SuppliersOrbit'));
console.log('\n========== Holding вокруг Suppliers ==========');
if (si !== -1) console.log(lines.slice(Math.max(0, si - 12), si + 8).join('\n'));

const sb = path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx');
console.log('\n========== SuppliersBlock.tsx ==========');
console.log(fs.readFileSync(sb, 'utf-8'));

console.log('\n✅ Пришлите скрин вывода');