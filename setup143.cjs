const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Главная орбита: «Перейти →» вместо дубля имени =================
let oh = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const oh0 = oh;
oh = oh.split('<span className="text-[9px] font-semibold text-cream text-center leading-tight">{r.name}</span>')
  .join('<span className="glass-chip text-[8px] uppercase tracking-[0.15em] px-2.5 py-1 text-cream/90">Перейти →</span>');
if (oh !== oh0) { fs.writeFileSync(P('src/components/OrbitHero.tsx'), oh, 'utf-8'); console.log('✓ 1. главная орбита: «Перейти →»'); }
else console.log('⚠ 1. OrbitHero: подпись не найдена');

// ================= 2) Поставщики: тап = сайт/карточка + кнопка =================
let so = fs.readFileSync(P('src/components/SuppliersOrbit.tsx'), 'utf-8');
const so0 = so;
const mobAnchor = "style={{ transform: 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + scale + ')', zIndex: z, opacity: 0.75 + depth * 0.25 }}";
if (so.includes(mobAnchor) && !so.includes('window.open(s.site')) {
  so = so.split(mobAnchor).join(mobAnchor + "\n onClick={() => { if (s.site) window.open(s.site, '_blank'); else if (hover === s.id) { setHover(null); pausedRef.current = false; } else show(s.id); }}");
}
so = so.split('<span className="text-[8px] font-semibold text-cream/85 text-center leading-tight break-words w-full">{s.name}</span>')
  .join('<span className="text-[8px] font-semibold text-cream/85 text-center leading-tight break-words w-full">{s.name}</span>\n<span className="glass-chip text-[7px] uppercase tracking-[0.12em] px-2 py-0.5 text-cream/90">{s.site ? \'Перейти →\' : \'Подробнее\'}</span>\n{hover === s.id && tooltip(s)}');
if (so !== so0) { fs.writeFileSync(P('src/components/SuppliersOrbit.tsx'), so, 'utf-8'); console.log('✓ 2. поставщики: клик + кнопка + карточка'); }
else console.log('⚠ 2. SuppliersOrbit: якоря не найдены');

// ================= 3) Акции: свайп в полном экране =================
let ps = fs.readFileSync(P('src/components/PromoStories.tsx'), 'utf-8');
const ps0 = ps;
ps = ps.split("import { useEffect, useState } from 'react';").join("import { useEffect, useRef, useState } from 'react';");
ps = ps.split('const [view, setView] = useState<number | null>(null);')
  .join('const [view, setView] = useState<number | null>(null);\nconst touchX = useRef<number | null>(null);');
ps = ps.split('<div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex items-center justify-center gap-3 px-3" onClick={() => setView(null)}>')
  .join('<div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex items-center justify-center gap-3 px-3" onClick={() => setView(null)} onTouchStart={(e) => (touchX.current = e.touches[0].clientX)} onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (touchX.current ?? 0); if (Math.abs(dx) < 50) return; if (dx < 0) setView((view + 1) % media.length); else setView((view + media.length - 1) % media.length); }}>');
if (ps !== ps0) { fs.writeFileSync(P('src/components/PromoStories.tsx'), ps, 'utf-8'); console.log('✓ 3. акции: свайп в полном экране'); }
else console.log('⚠ 3. PromoStories: якоря не найдены');

// ================= 4) Рестораны: круглая кнопка брони справа внизу =================
let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const rp0 = rp;
rp = rp.split('<button onClick={modal.open} className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-2xl shadow-black/30 px-8 py-4 text-sm uppercase tracking-widest font-medium" style={btnStyle}>Забронировать стол</button>')
  .join('<button onClick={modal.open} aria-label="Забронировать стол" className="lg:hidden fixed bottom-5 right-4 z-40 rounded-full shadow-2xl shadow-black/40 flex items-center justify-center active:scale-95 transition-transform" style={{ ...btnStyle, width: 52, height: 52 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></button>');
if (rp !== rp0) { fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8'); console.log('✓ 4. рестораны: круглая бронь справа внизу'); }
else console.log('⚠ 4. RestaurantPage: кнопка не найдена');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: 4 правки (перейти, тап, свайп, круглая бронь)"');
console.log('git pull --rebase');
console.log('git push');