const fs = require('fs');
const path = require('path');

let src = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// Удаляем повторные копии блока функции (оставляем первую)
function dedupeBlock(src, marker) {
  const first = src.indexOf(marker);
  if (first === -1) return src;
  let pos = first + marker.length;
  let count = 0;
  while (true) {
    const next = src.indexOf(marker, pos);
    if (next === -1) break;
    const end = src.indexOf('\n}\n', next);
    if (end === -1) break;
    src = src.slice(0, next) + src.slice(end + 3);
    pos = next;
    count++;
  }
  console.log('✓ ' + marker.slice(0, 30) + ': удалено дублей = ' + count);
  return src;
}

// Удаляем повторные одиночные строки (оставляем первую)
function dedupeLine(src, line) {
  const first = src.indexOf(line);
  if (first === -1) return src;
  let pos = first + line.length;
  let count = 0;
  while (true) {
    const n = src.indexOf(line, pos);
    if (n === -1) break;
    src = src.slice(0, n) + src.slice(n + line.length);
    count++;
  }
  console.log('✓ строка ' + line.trim().slice(0, 30) + ': удалено дублей = ' + count);
  return src;
}

src = dedupeBlock(src, 'function TeamMobileCard(');
src = dedupeBlock(src, 'function FloatingButtons() {');
src = dedupeLine(src, '  const [teamIdx, setTeamIdx] = useState(0);\n');
src = dedupeLine(src, '      <FloatingButtons />\n');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), src, 'utf-8');
console.log('\n✅ Дубли убраны! Теперь:\n   npm run build\n   git add . && git commit -m "фикс дублей" && git push\n');