const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const csPath = P('src/components/ContactsSection.tsx');
let cs = fs.readFileSync(csPath, 'utf-8');

const show = (label) => {
  const lines = cs.split('\n').filter((l) => l.toLowerCase().includes('astoria'));
  console.log('--- ' + label + ' ---');
  console.log(lines.join('\n') || '(строк с astoria нет)');
};

show('ДО замены');

// принудительно: ЛЮБАЯ строка astoria с координатами
const before = cs;
cs = cs.replace(/(astoria:\s*)\[[^\]]*\]/g, '$1[44.555746, 38.064224]');

if (cs !== before) {
  fs.writeFileSync(csPath, cs, 'utf-8');
  console.log('✓ замена выполнена');
} else {
  console.log('⚠ НЕЧЕГО заменять — шаблон astoria:[...] не найден');
}

show('ПОСЛЕ замены');

console.log('\nДальше: обнови localhost Cmd+Shift+R.');
console.log('Если строка ПОСЛЕ = 44.555746, 38.064224, а метка на сайте всё равно старая —');
console.log('перезапусти dev: Ctrl+C и npm run dev (файл карты мог закэшироваться).');