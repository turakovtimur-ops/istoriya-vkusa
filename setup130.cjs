const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.mkdirSync(P('public/images/suppliers'), { recursive: true });

let s = fs.readFileSync(P('src/data/suppliers.ts'), 'utf-8');
const name = 'Администрация Геленджика';
const i = s.indexOf(name);
if (i === -1) { console.log('⚠ запись не найдена — пришли файл src/data/suppliers.ts'); process.exit(0); }

const start = s.lastIndexOf('{', i);
const end = s.indexOf('}', i);
let nb = s.slice(start, end + 1);

// сайт
const siteRe = /site:\s*['"`][^'"`]*['"`]/;
if (siteRe.test(nb)) nb = nb.replace(siteRe, "site: 'https://admgel.ru/'");
else nb = nb.replace(/\s*\}$/, ",\n    site: 'https://admgel.ru/'\n  }");
// лого
const imgRe = /(image|logo|img|photo|icon):\s*['"`][^'"`]*['"`]/;
if (imgRe.test(nb)) nb = nb.replace(imgRe, (m, f) => f + ": '/images/suppliers/admgel.png'");
else nb = nb.replace(/\s*\}$/, ",\n    image: '/images/suppliers/admgel.png'\n  }");

s = s.slice(0, start) + nb + s.slice(end + 1);

// если в интерфейсе нет полей site/image — добавим, чтобы TS не ругался
const patchIface = (field) => {
  const ii = s.indexOf('interface');
  if (ii === -1) return;
  const ie = s.indexOf('}', ii);
  if (!s.slice(ii, ie).includes(field)) {
    s = s.slice(0, ie) + '  ' + field + '?: string;\n' + s.slice(ie);
  }
};
if (nb.includes('site:')) patchIface('site');
if (nb.includes('image:')) patchIface('image');

fs.writeFileSync(P('src/data/suppliers.ts'), s, 'utf-8');
console.log('✓ Администрация Геленджика: сайт admgel.ru + герб в данных');
console.log('Блок теперь выглядит так:\n' + nb);

console.log('\n✅ Выкатываем (НЕ ЗАБЫВАЙ про pull!):');
console.log('git pull --rebase');
console.log('npm run build');
console.log('git add -A && git commit -m "Администрация Геленджика: сайт и герб" && git push');