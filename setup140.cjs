const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const h0 = h;

// ================= 1) Бургер: нормальная иконка =================
const burgerRe = /<span className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">\s*<svg[\s\S]*?<\/svg>\s*<\/span>/;
if (burgerRe.test(h)) {
  h = h.replace(burgerRe,
`<span className="w-10 h-10 rounded-full bg-paper flex items-center justify-center overflow-hidden shadow-lg">
              <BrandImg src={holdingBrand.logo} alt={holdingBrand.name} fallback="ИВ" color={holdingBrand.gold} className="w-full h-full p-1.5" />
            </span>`);
  console.log('✓ бургер: иконка как в шапке');
} else console.log('⚠ бургер: блок не найден');

// ================= 2) Команда: дышит, точки, шире текст =================
h = h.split('<div className="w-32 -mr-6 opacity-50 pointer-events-none">').join('<div className="w-24 opacity-70 pointer-events-none">');
h = h.split('<div className="w-32 -ml-6 opacity-50 pointer-events-none">').join('<div className="w-24 opacity-70 pointer-events-none">');
h = h.split('<div className="w-32 h-32 rounded-full overflow-hidden border border-amber/40 bg-coal">').join('<div className="w-24 h-24 rounded-full overflow-hidden border border-amber/40 bg-coal">');
h = h.split('<div key={teamIdx} className="w-[62%] z-10 text-center px-2 team-anim">').join('<div key={teamIdx} className="w-[68%] z-10 text-center px-2 team-anim">');
h = h.split('<div className="flex items-start justify-center">').join('<div className="flex items-start justify-center gap-2">');
// точки-индикаторы + подсказка
const dotsAnchor = '<div className="hidden md:grid md:grid-cols-3 gap-8">';
if (h.includes(dotsAnchor) && !h.includes('team-dots')) {
  h = h.split(dotsAnchor).join(`<div className="team-dots md:hidden flex justify-center gap-2 mt-6">
          {team.map((m, i) => (
            <button key={m.id} onClick={() => setTeamIdx(i)} aria-label={m.name} className={'w-2.5 h-2.5 rounded-full transition-colors ' + (i === teamIdx ? 'bg-amber' : 'bg-cream/25')} />
          ))}
        </div>
        <p className="md:hidden text-center text-cream/40 text-[9px] tracking-[0.3em] uppercase mt-3">Листайте</p>
        ` + dotsAnchor);
  console.log('✓ команда: без наезда, шире, точки + листайте');
} else console.log('ℹ команда: точки уже есть или якорь не найден');

if (h !== h0) fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

// ================= 3) CSS: мероприятия каруселью + мягкая команда =================
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup140')) {
  css += `
/* ===== setup140: мобилка — мероприятия карусель, команда мягче ===== */
@media (max-width: 767px) {
  #events .grid, #events [class*="grid"] {
    display: flex !important;
    flex-direction: row !important;
    grid-template-columns: none !important;
    gap: 14px !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    padding-bottom: 14px;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch;
  }
  #events .grid > *, #events [class*="grid"] > * {
    flex: 0 0 auto !important;
    min-width: 86% !important;
    max-width: 86% !important;
    width: auto !important;
    scroll-snap-align: start;
  }
  #events .grid::-webkit-scrollbar, #events [class*="grid"]::-webkit-scrollbar { display: none; }
}
.team-anim { animation: teamInSoft 0.7s cubic-bezier(0.25, 0.8, 0.35, 1) !important; }
@keyframes teamInSoft {
  from { opacity: 0; transform: translateX(14px) scale(0.985); }
  to { opacity: 1; transform: none; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: мероприятия карусель + плавная команда');
}

// ================= 4) Орбита поставщиков: страховка от вылета =================
let o = fs.readFileSync(P('src/components/SuppliersOrbit.tsx'), 'utf-8');
const o0 = o;
if (o.includes('const mobileR = (w + 40) * 0.62;')) {
  o = o.split('const mobileR = (w + 40) * 0.62;').join('const mobileR = Math.min((w + 40) * 0.38, 170);');
}
if (o !== o0) { fs.writeFileSync(P('src/components/SuppliersOrbit.tsx'), o, 'utf-8'); console.log('✓ орбита поставщиков в экране'); }

console.log('\n✅ Ритуал:');
console.log('git pull --rebase');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка финал: бургер, команда, мероприятия" && git push');