const fs = require('fs');
const path = require('path');

let out = '';

out += '================= index.html =================\n';
out += fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8') + '\n';

out += '\n================= OrbitHero.tsx (весь) =================\n';
out += fs.readFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), 'utf-8') + '\n';

const h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const lines = h.split('\n');
out += '\n================= Holding: шапка (первые 45 строк компонента Header) =================\n';
const hi = lines.findIndex((l) => l.includes('function Header'));
out += lines.slice(hi, hi + 45).join('\n') + '\n';
out += '\n================= Holding: оверлей меню =================\n';
const oi = h.indexOf('{open && (');
out += h.slice(oi, h.indexOf('</>', oi)) + '\n';
out += '\n================= Holding: секция вакансий =================\n';
const vi = h.indexOf('<section id="vacancies"');
out += h.slice(vi, h.indexOf('</section>', vi) + 10) + '\n';

out += '\n================= index.css (весь) =================\n';
out += fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8') + '\n';

fs.writeFileSync(path.join(__dirname, 'mobile_audit.txt'), out, 'utf-8');
console.log('✅ Создан mobile_audit.txt (' + out.split('\n').length + ' строк)');
console.log('Откройте файл в VS Code (или Finder), выделите всё (Cmd+A), скопируйте (Cmd+C) и вставьте сюда в чат.');