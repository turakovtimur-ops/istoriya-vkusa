const fs = require('fs');
const path = require('path');

let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

const s = h.indexOf('{open && (');
const e = h.indexOf('</>');

if (s === -1 || e === -1 || e < s) {
  console.warn('⚠ оверлей не найден');
  process.exit(1);
}

const newInner = `{open && (
        <div className="fixed inset-0 z-[70] bg-night/95 flex flex-col" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} onClick={() => setOpen(false)}>
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-cream/10" onClick={(ev) => ev.stopPropagation()}>
            <a href="#/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E0D0B" strokeWidth="2" strokeLinecap="round">
                  <line x1="9" y1="4" x2="9" y2="20" />
                  <path d="M15 4c-1.5 2-2 4-2 6 0 1.5 1 2 2 2v8" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight text-amber">История Вкуса</span>
            </a>
            <button aria-label="Закрыть" onClick={() => setOpen(false)} className="glass-chip w-11 h-11 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 overflow-y-auto" onClick={(ev) => ev.stopPropagation()}>
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="py-3.5 text-3xl font-semibold tracking-tight text-cream/90 border-b border-cream/5 active:text-amber">
                {label}
              </a>
            ))}
          </nav>
          <div className="px-8 pb-10 pt-4" onClick={(ev) => ev.stopPropagation()}>
            <a href="tel:88002015757" className="inline-block text-sm tracking-[0.2em] uppercase text-amber border-b border-amber/40 pb-1 mb-4">
              8 800 201-57-57
            </a>
            <p className="text-cream/40 text-xs font-light">Геленджик · ресторанный холдинг</p>
          </div>
        </div>
      )}`;

h = h.slice(0, s) + newInner + '\n    ' + h.slice(e);
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
console.log('✓ бургер-меню: шапка с лого и крестиком, крупные пункты, телефон внизу');

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Бургер-меню премиальное" && git push');