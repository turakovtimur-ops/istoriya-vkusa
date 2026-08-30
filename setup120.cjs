const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) скан папки promos =================
const pdir = P('public/images/promos');
const list = [];
if (fs.existsSync(pdir)) {
  for (const f of fs.readdirSync(pdir).sort()) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const low = f.toLowerCase();
    let rest = 'all';
    for (const id of ['kinza', 'nino', 'astoria', 'la-costa']) if (low.startsWith(id)) rest = id;
    list.push({ id: f, restaurant: rest, src: '/images/promos/' + f });
  }
}
fs.writeFileSync(P('src/data/promos-media.ts'),
  '// генерируется setup120.cjs — после добавления плакатов запусти setup заново\n' +
  'export interface PromoMedia { id: string; restaurant: string; src: string }\n' +
  'export const PROMO_MEDIA: PromoMedia[] = ' + JSON.stringify(list, null, 2) + ';\n', 'utf-8');
console.log('✓ promos-media.ts: плакатов найдено — ' + list.length);

// ================= 2) компонент PromoStories =================
fs.writeFileSync(P('src/components/PromoStories.tsx'), `import { useEffect, useState } from 'react';
import { restaurants, promos } from '../data/holding';
import { PROMO_MEDIA } from '../data/promos-media';

export default function PromoStories() {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<number | null>(null);
  const media = PROMO_MEDIA.filter((m) => filter === 'all' || m.restaurant === filter || m.restaurant === 'all');
  const filteredPromos =
    filter === 'all' ? promos : promos.filter((p) => p.restaurants === 'all' || p.restaurants.includes(filter));

  useEffect(() => {
    if (view === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView(null);
      if (e.key === 'ArrowRight') setView((v) => (v === null ? v : (v + 1) % media.length));
      if (e.key === 'ArrowLeft') setView((v) => (v === null ? v : (v + media.length - 1) % media.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, media.length]);

  return (
    <div>
      <div className="reveal reveal-delay-1 mb-12 flex flex-wrap gap-2">
        <button
          onClick={() => { setFilter('all'); setView(null); }}
          className={'px-5 py-2.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all ' + (filter === 'all' ? 'bg-amber text-night border border-amber' : 'glass-chip text-cream/70')}
        >
          Все
        </button>
        {restaurants.map((r) => (
          <button
            key={r.id}
            onClick={() => { setFilter(r.id); setView(null); }}
            className={'px-5 py-2.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all ' + (filter === r.id ? 'bg-amber text-night border border-amber' : 'glass-chip text-cream/70')}
          >
            {r.name}
          </button>
        ))}
      </div>

      {media.length > 0 ? (
        <>
          <div className="flex gap-4 lg:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin' }}>
            {media.map((m, i) => {
              const r = restaurants.find((x) => x.id === m.restaurant);
              return (
                <button
                  key={m.id}
                  onClick={() => setView(i)}
                  className="snap-start flex-none w-[230px] md:w-[280px] aspect-[1080/1534] rounded-2xl overflow-hidden relative group border border-cream/10 hover:border-cream/30 transition-colors"
                >
                  <img src={m.src} alt={'Акция ' + (r ? r.name : 'История Вкуса')} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  {r && (
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-cream" style={{ background: r.accent }}>
                      {r.name}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-0 right-0 text-center text-[10px] uppercase tracking-[0.25em] text-cream/80">Смотреть</span>
                </button>
              );
            })}
          </div>
          <p className="text-cream/40 text-xs mt-2">Листай вбок · клик — полный экран</p>
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPromos.map((promo) => (
            <div key={promo.id} className="border border-cream/10 p-6 lg:p-8 hover:border-cream/30 transition-colors reveal">
              <div className="flex flex-wrap gap-2 mb-5">
                {promo.restaurants === 'all' ? (
                  <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 bg-cream/10 text-cream/80 rounded-full">Все рестораны</span>
                ) : (
                  promo.restaurants.map((id) => {
                    const r = restaurants.find((x) => x.id === id);
                    return r ? (
                      <span key={id} className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 text-cream rounded-full" style={{ background: r.accent }}>{r.name}</span>
                    ) : null;
                  })
                )}
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-5">{promo.title}</h3>
              {promo.items && (
                <ul className="space-y-2.5 mb-5">
                  {promo.items.map((item, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-4 text-sm border-b border-dotted border-cream/15 pb-2">
                      <span className="text-cream/70 font-light">{item.name}</span>
                      <span className="font-semibold whitespace-nowrap">{item.price} ₽</span>
                    </li>
                  ))}
                </ul>
              )}
              {promo.note && <p className="text-cream/60 text-sm font-light leading-relaxed">{promo.note}</p>}
            </div>
          ))}
        </div>
      )}

      {view !== null && media[view] && (
        <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex items-center justify-center gap-3 px-3" onClick={() => setView(null)}>
          <button
            aria-label="Назад"
            className="hidden md:flex w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 flex-none"
            onClick={(e) => { e.stopPropagation(); setView((view + media.length - 1) % media.length); }}
          >←</button>
          <div className="relative h-[88vh] max-h-[88vh] aspect-[1080/1534] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img src={media[view].src} alt="Акция" className="w-full h-full object-contain rounded-xl shadow-2xl" />
          </div>
          <button
            aria-label="Вперёд"
            className="hidden md:flex w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 flex-none"
            onClick={(e) => { e.stopPropagation(); setView((view + 1) % media.length); }}
          >→</button>
          <button
            aria-label="Закрыть"
            className="absolute top-5 right-5 w-12 h-12 rounded-full border border-cream/20 text-cream flex items-center justify-center hover:bg-cream/10"
            onClick={() => setView(null)}
          >✕</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, i) => (
              <button key={i} aria-label={'Сторис ' + (i + 1)} className={'h-1.5 rounded-full transition-all ' + (i === view ? 'w-8 bg-amber' : 'w-1.5 bg-cream/30')} onClick={(e) => { e.stopPropagation(); setView(i); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`, 'utf-8');
console.log('✓ PromoStories.tsx: карусель + полноэкранный просмотр');

// ================= 3) Holding: акции → сторис + копилка =================
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
if (!h.includes('PromoStories')) {
  h = h.replace("import SuppliersBlock from '../components/SuppliersBlock';",
    "import SuppliersBlock from '../components/SuppliersBlock';\nimport PromoStories from '../components/PromoStories';");
  const a = h.indexOf('<section id="promos"');
  const b = h.indexOf('<section id="vacancies"');
  if (a !== -1 && b !== -1) {
    h = h.slice(0, a) + '<section id="promos" className="py-16 lg:py-24 bg-coal">\n    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">\n      <div className="reveal mb-10">\n        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Акции</p>\n        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Сейчас в ресторанах</h2>\n      </div>\n      <PromoStories />\n    </div>\n  </section>\n  ' + h.slice(b);
    console.log('✓ секция «Акции» → сторис');
  } else console.log('⚠ секция promos не найдена');
}
// баг меню: '#promo s' → '#promos'
if (h.includes('#promo s')) { h = h.split('#promo s').join('#promos'); console.log('✓ меню: ссылка «Акции» исправлена'); }
// футер компактнее
if (h.includes('className="h-24 lg:h-28 w-auto object-contain"')) {
  h = h.split('className="h-24 lg:h-28 w-auto object-contain"').join('className="h-14 lg:h-16 w-auto object-contain"');
  h = h.split('text-cream/50 text-sm font-light mt-5').join('text-cream/50 text-sm font-light mt-3');
  console.log('✓ футер компактнее');
}
// скролл-память при обновлении
const scrollOld = "if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';\n    window.scrollTo(0, 0);";
if (h.includes(scrollOld)) {
  h = h.split(scrollOld).join("if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'auto';");
  console.log('✓ обновление не кидает наверх');
}
fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Акции-сторис + футер + скролл-память" && git push');