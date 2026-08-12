const fs = require('fs');
const path = require('path');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('⚠ не найдено:', label); return src; }
  console.log('✓', label);
  return src.replace(from, to);
}

let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// useRef для свайпа
h = rep(h, "import { useEffect, useState } from 'react'", "import { useEffect, useRef, useState } from 'react'", 'useRef');
h = rep(h, 'const [teamIdx, setTeamIdx] = useState(0);', 'const [teamIdx, setTeamIdx] = useState(0);\n  const touchX = useRef<number | null>(null);', 'touchX');

// 2) Меню: пункты и крестик в правый верхний угол
const os = h.indexOf('{open && (');
const oe = h.indexOf('</>', os);
if (os !== -1 && oe !== -1 && oe - os < 4000) {
  const newOverlay = `{open && (
        <div className="fixed inset-0 z-[70] bg-night/95 flex flex-col" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} onClick={() => setOpen(false)}>
          <button aria-label="Закрыть" className="absolute top-7 right-7 glass-chip w-11 h-11 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          <div className="px-8 pt-28 flex flex-col items-end gap-5 text-right">
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="text-2xl font-semibold tracking-tight text-cream/85">
                {label}
              </a>
            ))}
            <a href="tel:88002015757" className="mt-3 text-sm tracking-[0.2em] uppercase text-amber border-b border-amber/40 pb-1">
              8 800 201-57-57
            </a>
          </div>
        </div>
      )}
    `;
  h = h.slice(0, os) + newOverlay + h.slice(oe);
  console.log('✓ меню: правый верхний угол');
} else console.warn('⚠ оверлей меню не найден');

// 3) Команда: свайп + большие круги + анимация
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
            <div className="w-32 -mr-6 opacity-50 pointer-events-none">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-amber/40 bg-coal">
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
            <div className="w-32 -ml-6 opacity-50 pointer-events-none">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-amber/40 bg-coal">
                <TeamAvatar src={team[(teamIdx + 1) % team.length].photo} name={team[(teamIdx + 1) % team.length].name} />
              </div>
            </div>
          </div>
        </div>
          `;
  h = h.slice(0, carStart) + newCar + h.slice(carEnd);
  console.log('✓ команда: свайп, большие круги, анимация');
} else console.warn('⚠ карусель команды не найдена');

// 6) Вакансии: скрыть плашки-дубли на мобильном
const vm = h.indexOf('vacancies.map(');
if (vm !== -1) {
  const divPos = h.lastIndexOf('<div className="', vm);
  if (divPos !== -1 && vm - divPos < 400 && !h.slice(divPos, divPos + 60).includes('hidden lg:block')) {
    h = h.slice(0, divPos) + '<div className="hidden lg:block ' + h.slice(divPos + '<div className="'.length);
    console.log('✓ вакансии: плашки скрыты на мобильном');
  }
} else console.warn('⚠ vacancies.map не найден');

// 4) Кнопки: всегда справа, 44px
const fbs = h.indexOf('function FloatingButtons() {');
const fbe = h.indexOf('\n}\n', fbs);
if (fbs !== -1 && fbe !== -1) {
  const newFb = `function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3">
      <a href="tel:88002015757" aria-label="Позвонить" className="glass-btn flex items-center justify-center rounded-full" style={{ width: 44, height: 44 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Наверх" className="glass-btn flex items-center justify-center rounded-full" style={{ width: 44, height: 44 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}`;
  h = h.slice(0, fbs) + newFb + h.slice(fbe + 2);
  console.log('✓ кнопки: справа, всегда, 44px');
} else console.warn('⚠ FloatingButtons не найдены');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// 1) Герой: уплотнить
let o = fs.readFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), 'utf-8');
o = rep(o, 'min-h-screen', 'min-h-[62vh] lg:min-h-screen', 'герой компактнее на мобильном');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), o, 'utf-8');

// CSS: анимация команды + поставщики без ленты/карусели на мобильном
let css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf-8');
if (css.includes('setup61')) {
  console.log('✓ CSS setup61 уже есть');
} else {
  fs.appendFileSync(path.join(__dirname, 'src', 'index.css'), `
/* ===== setup61 ===== */
.team-anim { animation: teamIn .45s ease; }
@keyframes teamIn { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: none; } }
@media (max-width: 767px) {
  .marquee { display: none; }
  #suppliers .grid { display: none !important; }
}
`);
  console.log('✓ CSS setup61');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Шаг 5: мобильный адаптив" && git push');