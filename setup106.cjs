const fs = require('fs');
const path = require('path');
const root = __dirname;
let count = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(e.name)) continue;
      walk(p);
    } else if (/\.(html|ts|tsx|js|json|css)$/.test(e.name)) {
      let s = fs.readFileSync(p, 'utf-8');
      if (s.includes('КИНZA')) {
        s = s.split('КИНZA').join('Кинза');
        fs.writeFileSync(p, s, 'utf-8');
        count++;
        console.log('✓ исправлено: ' + path.relative(root, p));
      }
    }
  }
}

walk(root);
console.log(count ? '✅ Готово, файлов исправлено: ' + count : '⚠ КИНZA не найдена');
console.log('\nДальше одной строкой:');
console.log('npm run build && git add -A && git commit -m "SEO: Кинза вместо КИНZA" && git push');