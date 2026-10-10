import { useEffect, useRef, useState } from 'react';
import { restaurants } from '../data/holding';
import { news, NewsItem } from '../data/news';
import BrandImg from './BrandImg';

interface Props { resto?: string; onBook?: (restoId: string) => void; }

export default function NewsStories({ resto, onBook }: Props) {
  const [view, setView] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const items = news.filter((n) => {
    if (resto) return n.resto === resto;
    return true;
  });

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

  if (items.length === 0) return null;

  const renderPoster = (n: NewsItem, large = false) => {
    const r = n.resto ? restaurants.find((x) => x.id === n.resto) : undefined;
    if (n.poster) {
      return <img src={n.poster} alt={n.title} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center" style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)' }}>
        {r && (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 ring-2 ring-cream/20">
            <BrandImg src={r.roundLogo || r.logo} alt={r.name} fallback={r.name} color={r.accent} fit={r.roundLogo ? 'cover' : 'contain'} className={r.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-2'} />
          </div>
        )}
        <h3 className={'font-semibold tracking-tight text-cream leading-tight ' + (large ? 'text-xl md:text-2xl' : 'text-base')}>{n.title}</h3>
        <p className="text-cream/50 text-xs mt-3 uppercase tracking-[0.2em]">{n.date}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="flex gap-4 lg:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin' }}>
        {items.map((n, i) => {
          const r = n.resto ? restaurants.find((x) => x.id === n.resto) : undefined;
          return (
            <button
              key={n.id}
              onClick={() => setView(i)}
              className="snap-start flex-none w-[230px] md:w-[280px] aspect-[1080/1534] rounded-2xl overflow-hidden relative group border border-cream/10 hover:border-cream/30 transition-colors bg-coal text-left"
            >
              {renderPoster(n)}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              {r && (
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-cream" style={{ background: r.accent }}>
                  {r.name}
                </span>
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-cream/90 text-xs leading-snug line-clamp-3 mb-1.5">{n.title}</p>
                <p className="text-cream/60 text-[10px] uppercase tracking-[0.2em]">{n.date}</p>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-cream/60 text-xs mt-2">Листай вбок · клик — полный экран</p>

      {view !== null && items[view] && (() => {
        const n = items[view];
        const r = n.resto ? restaurants.find((x) => x.id === n.resto) : undefined;
        return (
          <div
            className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex items-center justify-center gap-4 px-3 py-6"
            onClick={() => setView(null)}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
              if (Math.abs(dx) < 50) return;
              if (dx < 0) setView((view + 1) % items.length);
              else setView((view + items.length - 1) % items.length);
            }}
          >
            <button
              aria-label="Назад"
              className="hidden md:flex w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 flex-none"
              onClick={(e) => { e.stopPropagation(); setView((view + items.length - 1) % items.length); }}
            >←</button>

            <div
              className="relative bg-coal rounded-2xl overflow-hidden shadow-2xl max-h-[88vh] w-full max-w-5xl grid md:grid-cols-[1fr_1.1fr]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[1080/1534] md:aspect-auto md:h-full overflow-hidden bg-night">
                {renderPoster(n, true)}
              </div>
              <div className="flex flex-col overflow-y-auto max-h-[88vh] p-6 md:p-10">
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  {r && (
                    <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full text-cream" style={{ background: r.accent }}>
                      {r.name}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-amber/15 text-amber">{n.tag}</span>
                  <span className="text-cream/60 text-xs ml-auto">{n.date}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-4xl font-medium text-cream leading-tight mb-6">{n.title}</h2>
                <p className="text-cream/80 text-sm md:text-base font-light leading-relaxed whitespace-pre-line">{n.text}</p>
                {r && onBook && (
                  <button
                    onClick={() => { setView(null); onBook(n.resto!); }}
                    className="mt-8 btn-terra self-start"
                  >
                    Забронировать в «{r.name}»
                  </button>
                )}
              </div>
            </div>

            <button
              aria-label="Вперёд"
              className="hidden md:flex w-12 h-12 rounded-full border border-cream/20 text-cream items-center justify-center hover:bg-cream/10 flex-none"
              onClick={(e) => { e.stopPropagation(); setView((view + 1) % items.length); }}
            >→</button>
            <button
              aria-label="Закрыть"
              className="absolute top-5 right-5 w-12 h-12 rounded-full border border-cream/20 text-cream flex items-center justify-center hover:bg-cream/10"
              onClick={() => setView(null)}
            >✕</button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {items.map((_, i) => (
                <button key={i} aria-label={'Новость ' + (i + 1)} className={'h-1.5 rounded-full transition-all ' + (i === view ? 'w-8 bg-amber' : 'w-1.5 bg-cream/30')} onClick={(e) => { e.stopPropagation(); setView(i); }} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
