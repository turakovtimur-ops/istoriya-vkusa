import { useEffect, useState } from 'react';
import { HoldingRestaurant } from '../data/holding';
import BrandImg from './BrandImg';

// Карусель фото ресторана: кроссфейд каждые 3 сек.
// Фото кладутся в public/images/gallery/<id>-1..5.jpg — подхватываются сами.
export default function RestaurantGallery({ r }: { r: HoldingRestaurant }) {
  const candidates = [1, 2, 3, 4, 5].map((n) => '/images/gallery/' + r.id + '-' + n + '.jpg');
  const [ok, setOk] = useState<boolean[]>(() => candidates.map(() => false));
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    candidates.forEach((src, i) => {
      const img = new Image();
      img.onload = () =>
        setOk((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeList = candidates.map((_, i) => i).filter((i) => ok[i]);
  const count = activeList.length;

  useEffect(() => {
    if (count < 2 || hover) return;
    const t = setInterval(() => setIdx((i) => i + 1), 3000);
    return () => clearInterval(t);
  }, [count, hover]);

  // Фото ещё не добавлены — показываем логотип
  if (count === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BrandImg src={r.logo} alt={r.name} fallback={r.name} color={r.accent} className="w-full h-full p-8" />
      </div>
    );
  }

  const current = activeList[idx % count];

  return (
    <div className="relative w-full h-full" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {candidates.map((src, i) =>
        ok[i] ? (
          <img
            key={i}
            src={src}
            alt={r.name}
            className={
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ' +
              (i === current ? 'opacity-100' : 'opacity-0')
            }
          />
        ) : null
      )}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {activeList.map((_, d) => (
            <span
              key={d}
              className={'w-1.5 h-1.5 rounded-full transition-colors ' + (d === idx % count ? 'bg-white' : 'bg-white/40')}
            />
          ))}
        </div>
      )}
    </div>
  );
}