const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ---------- 0) проверка иконок ----------
const idir = P('public/images/icons');
if (fs.existsSync(idir)) {
  console.log('✓ иконки: ' + fs.readdirSync(idir).join(', '));
} else {
  console.log('⚠ папки public/images/icons нет!');
}

// ---------- 1) ContactsSection: номера ресторанов → иконки ----------
const cf = P('src/components/ContactsSection.tsx');
let c = fs.readFileSync(cf, 'utf-8');
const numRe = /\{(i|idx|n|index)\s*\+\s*1\}/;
const m = c.match(numRe);
if (m) {
  const line = c.slice(Math.max(0, m.index - 200), m.index + 50).split('\n').slice(-3).join(' | ');
  console.log('  найден кружок с номером: ...' + line);
  c = c.replace(numRe,
    "{<img src={'/images/icons/' + r.id + '.jpeg'} alt={r.name} className=\"w-full h-full object-cover rounded-full\" />}"
  );
  fs.writeFileSync(cf, c, 'utf-8');
  console.log('✓ номера ресторанов заменены на иконки (партнёры не тронуты)');
} else {
  console.log('⚠ кружок с номером не найден — вот файл, пришли скрин:');
  console.log(c.slice(0, 3000));
}

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Иконки ресторанов в контактах" && git push');
console.log('ℹ Маркеры НА самой карте меняются в конструкторе Яндекс Карт (вручную), виджет подтянет сам.');