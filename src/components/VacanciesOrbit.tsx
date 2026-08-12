import { useState } from 'react';
import { vacancies, holdingBrand } from '../data/holding';
import BrandImg from './BrandImg';

// Асимметричная живая раскладка: угол (градусы) и радиус (доля R)
const SPOTS = [
  { a: -90, r: 1 },
  { a: -35, r: 0.8 },
  { a: 15, r: 1 },
  { a: 65, r: 0.85 },
  { a: 115, r: 1 },
  { a: 165, r: 0.8 },
  { a: 210, r: 0.95 },
];

const isMob = window.innerWidth < 1024;
const W = Math.min(1100, window.innerWidth - 8);
const H = isMob ? 430 : 500;
const R = isMob ? W * 0.42 : 300;
const RY = isMob ? 0.9 : 0.42;

export default function VacanciesOrbit({ onApply }: { onApply: (v: string) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const cx = W / 2;
  const cy = H / 2;

  const pos = (i: number) => {
    const s = SPOTS[i % SPOTS.length];
    const rad = (s.a * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * R * s.r,
      y: cy + Math.sin(rad) * R * s.r * RY,
    };
  };

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      {/* Линии от солнца к пузырям */}
      <svg className="absolute inset-0" width={W} height={H}>
        {vacancies.map((v, i) => {
          const p = pos(i);
          return (
            <line
              key={v}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={hover === i ? 'rgba(194,160,118,0.9)' : 'rgba(194,160,118,0.28)'}
              strokeWidth="1"
              style={{ transition: 'stroke 0.3s' }}
            />
          );
        })}
      </svg>

      {/* Солнце-бренд */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 sun-glow rounded-full overflow-hidden"
        style={{ width: isMob ? 108 : 140, height: isMob ? 108 : 140 }}
      >
        <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
        <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
      </div>

      {/* Пузыри-вакансии */}
      {vacancies.map((v, i) => {
        const p = pos(i);
        return (
          <div
            key={v}
            className="absolute"
            style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)', zIndex: 20 }}
          >
            <button
              onClick={() => onApply(v)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group glass-chip bubble-float block px-4 py-2.5 text-[10px] uppercase tracking-wider text-cream/90"
              style={{ animationDelay: (i * 0.55) + 's' }}
            >
              {v}
              <span className="block text-[8px] normal-case tracking-normal text-amber/90 mt-1">
                Заполнить анкету →
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
