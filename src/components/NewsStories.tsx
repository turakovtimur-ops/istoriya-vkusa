import { useEffect, useState } from 'react';
import { restaurants } from '../data/holding';
import { news, NewsItem } from '../data/news';
import BrandImg from './BrandImg';

interface Props { resto?: string; onBook?: (restoId: string) => void; }

export default function NewsStories({ resto, onBook }: Props) {
  const [view, setView] = useState<number | null>(null);
  const items = news.filter((n) => (resto ? n.resto === resto : true)).filter((n) => !n.dateEnd || new Date(n.dateEnd + 'T23:59:59') >= new Date());

  useEffect(() => {
    if (view === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView(null);
      if (e.key === 'ArrowRight') setView((v) => (v === null ? v : (v + 1) % items.length));
      if (e.key === 'ArrowLeft') setView((v) => (v === null ? v : (v + items.length - 1) % items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, items.length]);

  useEffect(() => {
    const lock = view !== null ? 'hidden' : '';
    document.body.style.overflow = lock;
    document.documentElement.style.overflow = lock;
    return () => { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; };
  }, [view]);

  if (items.length === 0) return null;

  const next = () => setView(((view ?? 0) + 1) % items.length);
  const prev = () => setView(((view ?? 0) + items.length - 1) % items.length);

  const fallback = (n: NewsItem, large: boolean) => {
    const r = n.resto ? restaurants.find((x) => x.id === n.resto) : undefined;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center" style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)' }}>
        {r && (
          <div className={'rounded-full overflow-hidden mb-4 ring-2 ring-cream/20 ' + (large ? 'w-24 h-24' : 'w-20 h-20')}>
            <BrandImg src={r.roundLogo || r.logo} alt={r.name} fallback={r.name} color={r.accent} fit={r.roundLogo ? 'cover' : 'contain'} className={r.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-2'} />
          </div>
        )}
        <h3 className={'font-semibold tracking-tight text-cream leading-tight ' + (large ? 'text-xl md:text-2xl' : 'text-base')}>{n.title}</h3>
        <p className="text-cream/50 text-xs mt-3 uppercase tracking-[0.2em]">{n.date}</p>
      </div>
    );
  };

  const cur = view !== null ? items[view] : null;
  const curR = cur && cur.resto ? restaurants.find((x) => x.id === cur.resto) : undefined;

  return (
    <div>
      <div className="flex gap-4 lg:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin' }}>
        {items.map((n, i) => {
          const r = n.resto ? restaurants.find((x) => x.id === n.resto) : undefined;
          return (
            <button key={n.id} onClick={() => setView(i)} className="snap-start flex-none w-[230px] md:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden relative group border border-cream/10 hover:border-cream/30 transition-colors bg-night text-left">
              {n.poster ? (
                <img src={n.poster} alt={n.title} loading="lazy" className="w-full h-full object-contain" style={{ background: '#0d0c0a' }} />
              ) : fallback(n, false)}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              {r && <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-cream" style={{ background: r.accent }}>{r.name}</span>}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-cream/90 text-xs leading-snug line-clamp-2 mb-1.5">{n.title}</p>
                <p className="text-cream/60 text-[10px] uppercase tracking-[0.2em]">{n.date}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-cream/60 text-xs mt-2">Листай вбок · клик — полный экран</p>

      {cur && (
        <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl overflow-y-auto md:overflow-hidden" onClick={() => setView(null)}>
          <div className="sticky top-0 z-30 flex md:hidden items-center gap-2 p-3 bg-night/95 backdrop-blur" onClick={(e) => e.stopPropagation()}>
            {curR && onBook && (
              <button onClick={() => { setView(null); onBook(cur.resto!); }} className="flex-1 btn-terra py-3 text-xs uppercase tracking-widest">Забронировать в «{curR.name}»</button>
            )}
            <button aria-label="Закрыть" className="w-11 h-11 rounded-full border border-cream/20 text-cream flex items-center justify-center" onClick={() => setView(null)}>✕</button>
          </div>

          <div className="md:h-full md:flex md:items-center md:justify-center px-3 pb-6 md:p-6">
            <div className="relative bg-coal rounded-2xl overflow-hidden shadow-2xl md:w-full md:max-w-5xl md:h-[88vh] md:grid md:grid-cols-[1fr_1.1fr]" onClick={(e) => e.stopPropagation()}>
              <div className="p-3 md:p-0 md:h-full md:min-h-0 bg-night">
                {cur.poster ? (
                  <img src={cur.poster} alt={cur.title} className="w-full h-auto md:h-full md:w-full object-contain rounded-xl md:rounded-none" />
                ) : (
                  <div className="aspect-[3/4] md:aspect-auto md:h-full">{fallback(cur, true)}</div>
                )}
              </div>
              <div className="flex flex-col p-5 md:p-10 md:h-full md:min-h-0 bg-coal">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {curR && <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-cream" style={{ background: curR.accent }}>{curR.name}</span>}
                  <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-amber/15 text-amber">{cur.tag}</span>
                  <span className="text-cream/60 text-xs md:ml-auto">{cur.date}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-4xl font-medium text-cream leading-tight mb-5">{cur.title}</h2>
                <p className="text-cream/80 text-sm md:text-base font-light leading-relaxed whitespace-pre-line md:flex-1 md:min-h-0 md:overflow-hidden">{cur.text}</p>
                {curR && onBook && (
                  <button onClick={() => { setView(null); onBook(cur.resto!); }} className="hidden md:inline-flex mt-6 btn-terra self-start">Забронировать в «{curR.name}»</button>
                )}
              </div>
            </div>
          </div>

          <button aria-label="Назад" className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 z-40" onClick={(e) => { e.stopPropagation(); prev(); }}>←</button>
          <button aria-label="Вперёд" className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 z-40" onClick={(e) => { e.stopPropagation(); next(); }}>→</button>
          <button aria-label="Закрыть" className="hidden md:flex fixed top-5 right-5 w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 z-40" onClick={() => setView(null)}>✕</button>
          <div className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 gap-2 z-40">
            {items.map((_, i) => (
              <button key={i} aria-label={'Новость ' + (i + 1)} className={'h-1.5 rounded-full transition-all ' + (i === view ? 'w-8 bg-amber' : 'w-1.5 bg-cream/30')} onClick={(e) => { e.stopPropagation(); setView(i); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
