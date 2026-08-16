const fs = require('fs');
const path = require('path');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('⚠ не найдено:', label); return src; }
  console.log('✓', label);
  return src.replace(from, to);
}

let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// 1) Команда: свайп + большие боковые круги + анимация
const carStart = h.indexOf('<div className="md:hidden relative">');
const carEnd = h.indexOf('<div className="hidden md:grid md:grid-cols-3 gap-8">');
if (carStart !== -1 && carEnd !== -1) {
  const newCar = `<div
          className="md:hidden relative"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
            if (dx < -40) setTeamIdx((teamIdx + 1) % team.length);
            if (dx > 40) setTeamIdx((teamIdx + team.length - 1) % team.length);
          }}
        >
          <div className="flex items-start justify-center">
            <div className="w-24 -mr-5 opacity-50 pointer-events-none">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-amber/40 bg-coal">
                <TeamAvatar src={team[(teamIdx + team.length - 1) % team.length].photo} name={team[(teamIdx + team.length - 1) % team.length].name} />
              </div>
            </div>
            <div key={teamIdx} className="w-[62%] z-10 text-center px-2 team-anim">
              <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber/60 bg-coal" style={{ boxShadow: '0 0 30px rgba(194,160,118,0.2)' }}>
                <TeamAvatar src={team[teamIdx].photo} name={team[teamIdx].name} />
              </div>
              <p className="text-amber text-[9px] uppercase tracking-[0.3em] mb-1.5 font-medium">{team[teamIdx].role}</p>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{team[teamIdx].name}</h3>
              <p className="text-cream/60 text-xs font-light leading-relaxed">{team[teamIdx].desc}</p>
            </div>
            <div className="w-24 -ml-5 opacity-50 pointer-events-none">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-amber/40 bg-coal">
                <TeamAvatar src={team[(teamIdx + 1) % team.length].photo} name={team[(teamIdx + 1) % team.length].name} />
              </div>
            </div>
          </div>
        </div>
          `;
  h = h.slice(0, carStart) + newCar + h.slice(carEnd);
  console.log('✓ команда: свайп + большие круги + анимация');
} else console.warn('⚠ карусель команды не найдена');

// 2) Шапка прячется при скролле вниз (мобайл)
const titleLine = "useEffect(() => { document.title = 'История Вкуса — рестораны в Геленджике'; }, []);";
const hideHeader = `

  // Мобайл: шапка прячется при скролле вниз, появляется при скролле вверх
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (window.innerWidth >= 1024) return;
      const y = window.scrollY;
      const el = document.querySelector('header') as HTMLElement | null;
      if (el) el.style.transform = y > lastY && y > 240 ? 'translateY(-130%)' : 'translateY(0)';
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);`;
if (h.includes('hideHeaderDone')) {
  console.log('✓ шапка-скролл уже есть');
} else if (h.includes(titleLine)) {
  h = h.replace(titleLine, titleLine + hideHeader + "\n  // hideHeaderDone");
  console.log('✓ шапка прячется при скролле вниз');
} else console.warn('⚠ title-эффект не найден');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// 7) Орбиты на 320px чуть компактнее
for (const f of ['VacanciesOrbit.tsx', 'SuppliersOrbit.tsx']) {
  let o = fs.readFileSync(path.join(__dirname, 'src', 'components', f), 'utf-8');
  o = rep(o, '* 0.42,', '* 0.38,', f + ': радиус мобайла 0.38');
  o = rep(o, '* 0.42)', '* 0.38)', f + ': радиус мобайла 0.38 (скобка)');
  fs.writeFileSync(path.join(__dirname, 'src', 'components', f), o, 'utf-8');
}

// CSS: карусели мероприятий/ресторанов, кнопки, контакты, отступы акций
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
if (css.includes('setup78')) {
  console.log('✓ CSS setup78 уже есть');
} else {
  fs.appendFileSync(path.join(__dirname, 'src', 'index.css'), `
/* ===== setup78 ===== */
.team-anim { animation: teamIn .45s ease; }
@keyframes teamIn { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: none; } }
@media (max-width: 1023px) {
  header { transition: transform .4s ease; }
}
@media (max-width: 767px) {
  #events .grid, #restaurants .grid {
    display: flex !important;
    gap: 14px !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    padding-bottom: 14px;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch;
  }
  #events .grid > *, #restaurants .grid > * { flex: 0 0 auto; min-width: 86%; scroll-snap-align: start; }
  #events .grid::-webkit-scrollbar, #restaurants .grid::-webkit-scrollbar { display: none; }
  #events .reveal, #restaurants .reveal { opacity: 1 !important; transform: none !important; }
  #promos .grid { padding-left: 16px; padding-right: 16px; }
  .fixed.bottom-5.right-4 { bottom: 10px; right: 10px; }
  .fixed.bottom-5.right-4 a, .fixed.bottom-5.right-4 button { width: 40px !important; height: 40px !important; }
  #contacts a[href^="tel:"] { font-size: 15px; font-weight: 500; }
}
@media (max-width: 400px) {
  #promos .grid > *, #partners .grid > *, #events .grid > *, #restaurants .grid > * { min-width: 92%; }
}
`);
  console.log('✓ CSS setup78');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Мобильные правки 1-8" && git push');