const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Новый компонент RestaurantPromos =================
fs.writeFileSync(P('src/components/RestaurantPromos.tsx'), `import { useEffect, useRef, useState } from 'react';
import { promos, HoldingRestaurant } from '../data/holding';
import { PROMO_MEDIA } from '../data/promos-media';

interface Props { restaurant: HoldingRestaurant; dark: boolean; }

export default function RestaurantPromos({ restaurant, dark }: Props) {
  const [view, setView] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const media = PROMO_MEDIA.filter((m) => m.restaurant === restaurant.id || m.restaurant === 'all');
  const textPromos = promos.filter((p) => p.restaurants === 'all' || p.restaurants.includes(restaurant.id));
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
  if (media.length === 0 && textPromos.length === 0) return null;
  const accent = restaurant.accent;
  const cHead = dark ? 'text-cream' : 'text-graphite';
  const cSoft = dark ? 'text-cream/70' : 'text-graphite/70';
  const cMute = dark ? 'text-cream/40' : 'text-graphite/40';
  const cardBorder = dark ? 'border-cream/10 hover:border-cream/30' : 'border-black/10 hover:border-black/25';
  return (
    <section id="promos" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="reveal mb-10">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Акции</p>
          <h2 className={'text-4xl md:text-6xl font-semibold tracking-tighter ' + cHead}>Сейчас у нас</h2>
        </div>
        {media.length > 0 ? (
          <>
            <div className="flex gap-4 lg:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin' }}>
              {media.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setView(i)}
                  className={'snap-start flex-none w-[230px] md:w-[280px] aspect-[1080/1534] rounded-2xl overflow-hidden relative group border transition-colors ' + cardBorder}
                >
                  <img src={m.src} alt={'Акция ' + restaurant.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-cream" style={{ background: m.restaurant === 'all' ? '#C2A076' : accent }}>
                    {m.restaurant === 'all' ? 'Все рестораны' : restaurant.name}
                  </span>
                  <span className="absolute bottom-3 left-0 right-0 text-center text-[10px] uppercase tracking-[0.25em] text-cream/80">Смотреть</span>
                </button>
              ))}
            </div>
            <p className={cMute + ' text-xs mt-2'}>Листай вбок · клик — полный экран</p>
          </>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {textPromos.map((promo) => (
              <div key={promo.id} className={'border p-6 lg:p-8 transition-colors reveal ' + cardBorder}>
                <h3 className={'text-2xl lg:text-3xl font-semibold tracking-tight mb-5 ' + cHead}>{promo.title}</h3>
                {promo.items && (
                  <ul className="space-y-2.5 mb-5">
                    {promo.items.map((item, i) => (
                      <li key={i} className={'flex items-baseline justify-between gap-4 text-sm border-b border-dotted pb-2 ' + (dark ? 'border-cream/15' : 'border-graphite/15')}>
                        <span className={cSoft + ' font-light'}>{item.name}</span>
                        <span className={'font-semibold whitespace-nowrap ' + cHead}>{item.price} ₽</span>
                      </li>
                    ))}
                  </ul>
                )}
                {promo.note && <p className={cMute + ' text-sm font-light leading-relaxed'}>{promo.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      {view !== null && media[view] && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex items-center justify-center gap-3 px-3"
          onClick={() => setView(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (touchX.current ?? 0); if (Math.abs(dx) < 50) return; if (dx < 0) setView((view + 1) % media.length); else setView((view + media.length - 1) % media.length); }}
        >
          <button aria-label="Назад" className="hidden md:flex w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 flex-none" onClick={(e) => { e.stopPropagation(); setView((view + media.length - 1) % media.length); }}>←</button>
          <div className="relative h-[88vh] max-h-[88vh] aspect-[1080/1534] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img src={media[view].src} alt="Акция" className="w-full h-full object-contain rounded-xl shadow-2xl" />
          </div>
          <button aria-label="Вперёд" className="hidden md:flex w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 flex-none" onClick={(e) => { e.stopPropagation(); setView((view + 1) % media.length); }}>→</button>
          <button aria-label="Закрыть" className="absolute top-5 right-5 w-12 h-12 rounded-full border border-cream/20 text-cream flex items-center justify-center hover:bg-cream/10" onClick={() => setView(null)}>✕</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, i) => (
              <button key={i} aria-label={'Сторис ' + (i + 1)} className={'h-1.5 rounded-full transition-all ' + (i === view ? 'w-8 bg-amber' : 'w-1.5 bg-cream/30')} onClick={(e) => { e.stopPropagation(); setView(i); }} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
`, 'utf-8');
console.log('✓ src/components/RestaurantPromos.tsx создан');

// ================= 2) Вставка в RestaurantPage =================
let rp = fs.readFileSync(P('src/components/RestaurantPage.tsx'), 'utf-8');
const rp0 = rp;
rp = rp.split("import BookingModal from '../components/BookingModal';")
  .join("import BookingModal from '../components/BookingModal';\nimport RestaurantPromos from '../components/RestaurantPromos';");
rp = rp.split('<section id="menu"')
  .join('<RestaurantPromos restaurant={restaurant} dark={dark} />\n    <section id="menu"');
if (rp !== rp0) { fs.writeFileSync(P('src/components/RestaurantPage.tsx'), rp, 'utf-8'); console.log('✓ RestaurantPage: блок акций между «Ресторан» и «Меню»'); }
else console.log('⚠ RestaurantPage: якоря не найдены — пришли файл');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Акции на страницах ресторанов (автофильтр)" && git pull --rebase && git push');