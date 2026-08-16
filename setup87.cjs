const fs = require('fs');
const path = require('path');

// ---------- 1) Порядок блоков и шапки — как в макете ----------
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

const ids = ['history', 'team', 'restaurants', 'partners', 'promos', 'vacancies', 'suppliers', 'events', 'contacts'];
const newOrder = ['history', 'team', 'restaurants', 'partners', 'promos', 'vacancies', 'suppliers', 'events', 'contacts'];

const pos = {}, ends = {};
let allFound = true;
for (const id of ids) {
  const s = h.indexOf('<section id="' + id + '"');
  if (s === -1) { console.warn('⚠ секция не найдена: ' + id); allFound = false; continue; }
  const e = h.indexOf('</section>', s);
  pos[id] = s; ends[id] = e + '</section>'.length;
}
if (allFound) {
  const sorted = ids.slice().sort((a, b) => pos[a] - pos[b]);
  let contiguous = true;
  for (let i = 1; i < sorted.length; i++) {
    if (h.slice(ends[sorted[i - 1]], pos[sorted[i]]).trim() !== '') { contiguous = false; console.warn('⚠ не подряд: ' + sorted[i - 1] + ' / ' + sorted[i]); }
  }
  if (contiguous) {
    const chunks = {};
    for (const id of ids) chunks[id] = h.slice(pos[id], ends[id]);
    const first = pos[sorted[0]];
    const last = Math.max(...ids.map((id) => ends[id]));
    h = h.slice(0, first) + newOrder.map((id) => chunks[id]).join('\n\n      ') + h.slice(last);
    console.log('✓ порядок блоков как в макете');
  }
} else console.warn('⚠ порядок не менял');

const ls = h.indexOf('const links');
const le = h.indexOf('];', ls);
if (ls !== -1 && le !== -1) {
  h = h.slice(0, ls) + "const links = [\n    ['#history', 'История'],\n    ['#team', 'Команда'],\n    ['#restaurants', 'Рестораны'],\n    ['#partners', 'Партнёры'],\n    ['#promos', 'Акции'],\n    ['#vacancies', 'Вакансии'],\n    ['#suppliers', 'Поставщики'],\n    ['#events', 'Мероприятия'],\n    ['#contacts', 'Контакты'],\n  ] as [string, string][];" + h.slice(le + 2);
  console.log('✓ шапка = порядок макета');
}

// ---------- 2) Вакансии: орбита на мобиле, плашки скрыты ----------
const vi = h.indexOf('<VacanciesOrbit');
if (vi !== -1) {
  const ds = h.lastIndexOf('<div className="', vi);
  const de = h.indexOf('">', ds);
  const tag = h.slice(ds, de);
  if (tag.includes('hidden lg:block')) {
    h = h.slice(0, ds) + tag.replace('hidden lg:block', 'block') + h.slice(ds + tag.length);
    console.log('✓ вакансии: орбита на мобиле');
  } else console.log('✓ вакансии: орбита уже видна');
}
if (h.includes('flex flex-wrap gap-3 lg:hidden mt-2')) {
  h = h.replace('flex flex-wrap gap-3 lg:hidden mt-2', 'hidden');
  console.log('✓ вакансии: плашки скрыты');
}
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// ---------- 3) Герой: без дыры на мобиле ----------
let oh = fs.readFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), 'utf-8');
if (oh.includes('min-h-[62vh] lg:min-h-screen')) {
  oh = oh.replace('min-h-[62vh] lg:min-h-screen', 'lg:min-h-screen');
  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), oh, 'utf-8');
  console.log('✓ герой: орбита сразу под слоганом');
} else console.log('✓ герой: уже компактный');

// ---------- 4) CSS: карусели как в макете ----------
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
if (css.includes('setup87')) {
  console.log('✓ CSS setup87 уже есть');
} else {
  fs.appendFileSync(path.join(__dirname, 'src', 'index.css'), `
/* ===== setup87: мобильные карусели как в макете ===== */
@media (max-width: 767px) {
  #restaurants .grid, #partners .grid, #promos .grid, #events .grid {
    display: flex !important;
    gap: 14px !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    padding-bottom: 14px;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch;
  }
  #restaurants .grid > *, #partners .grid > *, #promos .grid > *, #events .grid > * {
    flex: 0 0 auto;
    min-width: 86%;
    scroll-snap-align: start;
  }
  #restaurants .grid::-webkit-scrollbar, #partners .grid::-webkit-scrollbar,
  #promos .grid::-webkit-scrollbar, #events .grid::-webkit-scrollbar { display: none; }
  #restaurants .reveal, #partners .reveal, #promos .reveal, #events .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
  #restaurants img {
    display: block !important;
    width: 100% !important;
    height: 150px !important;
    object-fit: cover !important;
    border-radius: 0 !important;
  }
  #promos .flex-wrap {
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
  #promos .flex-wrap::-webkit-scrollbar { display: none; }
  #promos .flex-wrap > * { flex: 0 0 auto; }
}
@media (max-width: 400px) {
  #restaurants .grid > *, #partners .grid > *, #promos .grid > *, #events .grid > * { min-width: 90%; }
}
`);
  console.log('✓ CSS setup87: карусели как в макете');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add -A && git commit -m "Мобайл по макету (поверх чистого CSS)" && git push --force');