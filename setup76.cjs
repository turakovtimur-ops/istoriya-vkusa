const fs = require('fs');
const path = require('path');

let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

const ids = ['history', 'team', 'restaurants', 'partners', 'promos', 'vacancies', 'suppliers', 'events', 'contacts'];
const newOrder = ['history', 'restaurants', 'promos', 'events', 'partners', 'team', 'vacancies', 'suppliers', 'contacts'];

const pos = {};
const ends = {};
let allFound = true;
for (const id of ids) {
  const s = h.indexOf('<section id="' + id + '"');
  if (s === -1) { console.warn('⚠ секция не найдена: ' + id); allFound = false; continue; }
  const e = h.indexOf('</section>', s);
  if (e === -1) { console.warn('⚠ конец секции не найден: ' + id); allFound = false; continue; }
  pos[id] = s;
  ends[id] = e + '</section>'.length;
}

if (allFound) {
  const sorted = ids.slice().sort((a, b) => pos[a] - pos[b]);
  let contiguous = true;
  for (let i = 1; i < sorted.length; i++) {
    const between = h.slice(ends[sorted[i - 1]], pos[sorted[i]]);
    if (between.trim() !== '') { contiguous = false; console.warn('⚠ между ' + sorted[i - 1] + ' и ' + sorted[i] + ' есть код'); }
  }
  if (contiguous) {
    const chunks = {};
    for (const id of ids) chunks[id] = h.slice(pos[id], ends[id]);
    const first = pos[sorted[0]];
    const last = Math.max(...ids.map((id) => ends[id]));
    const newBody = newOrder.map((id) => chunks[id]).join('\n\n      ');
    h = h.slice(0, first) + newBody + h.slice(last);
    console.log('✓ блоки переставлены: ' + newOrder.join(' → '));
  } else console.warn('⚠ перестановка пропущена (секции не подряд)');
}

// шапка: 9 пунктов
const ls = h.indexOf('const links');
const le = h.indexOf('];', ls);
if (ls !== -1 && le !== -1) {
  h = h.slice(0, ls) + "const links = [\n    ['#history', 'История'],\n    ['#restaurants', 'Рестораны'],\n    ['#promos', 'Акции'],\n    ['#events', 'Мероприятия'],\n    ['#partners', 'Партнёры'],\n    ['#team', 'Команда'],\n    ['#vacancies', 'Вакансии'],\n    ['#suppliers', 'Поставщики'],\n    ['#contacts', 'Контакты'],\n  ] as [string, string][];" + h.slice(le + 2);
  console.log('✓ шапка: 9 пунктов в новом порядке');
} else console.warn('⚠ links не найден');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
console.log('\n✅ Дальше: node setup77.cjs, затем build/commit/push');