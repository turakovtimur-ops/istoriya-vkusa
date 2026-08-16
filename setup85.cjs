const fs = require('fs');
const path = require('path');

// ---------- Вакансии: орбита на мобиле, плашки скрыты ----------
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
const vi = h.indexOf('<VacanciesOrbit');
if (vi !== -1) {
  const ds = h.lastIndexOf('<div className="', vi);
  const de = h.indexOf('">', ds);
  const tag = h.slice(ds, de);
  if (tag.includes('hidden lg:block')) {
    h = h.slice(0, ds) + tag.replace('hidden lg:block', 'block') + h.slice(ds + tag.length);
    console.log('✓ вакансии: орбита видна на мобиле');
  } else console.log('✓ вакансии: орбита уже видна');
} else console.warn('⚠ VacanciesOrbit не найден');

if (h.includes('flex flex-wrap gap-3 lg:hidden mt-2')) {
  h = h.replace('flex flex-wrap gap-3 lg:hidden mt-2', 'hidden');
  console.log('✓ вакансии: плашки скрыты (орбита вместо них)');
}
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// ---------- проверка контейнера ресторанов ----------
const crPath = path.join(__dirname, 'src', 'components', 'CinematicRestaurants.tsx');
const cr = fs.readFileSync(crPath, 'utf-8');
console.log('рестораны: контейнер grid =', cr.includes('grid'));

// ---------- CSS: карусели как в макете ----------
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
if (css.includes('setup85')) {
  console.log('✓ CSS setup85 уже есть');
} else {
  fs.appendFileSync(path.join(__dirname, 'src', 'index.css'), `
/* ===== setup85: карусели как в макете ===== */
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
    opacity: 1 !important; transform: none !important;
  }
  #restaurants img {
    display: block !important;
    width: 100% !important;
    height: 150px !important;
    object-fit: cover !important;
    border-radius: 0 !important;
  }
}
@media (max-width: 400px) {
  #restaurants .grid > *, #partners .grid > *, #promos .grid > *, #events .grid > * { min-width: 90%; }
}
`);
  console.log('✓ CSS setup85: карусели + компактные лого');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Мобайл по макету: карусели и орбиты" && git push');