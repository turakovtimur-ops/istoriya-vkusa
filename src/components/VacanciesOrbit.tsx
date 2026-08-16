import { useEffect, useState } from 'react';
import { vacancies, holdingBrand } from '../data/holding';
import BrandImg from './BrandImg';

const SPOTS = [
  { a: -90, r: 1 },
  { a: -35, r: 0.8 },
  { a: 15, r: 1 },
  { a: 65, r: 0.85 },
  { a: 115, r: 1 },
  { a: 165, r: 0.8 },
  { a: 210, r: 0.95 },
];

const M_ORBITS = [1, 0.8, 0.62, 0.46];
const M_RY = 0.8;
const M_PHASES = [45, 135, 225, 315, 90, 180, 270];

export default function VacanciesOrbit({ onApply }: { onApply: (v: string) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const [isMob, setIsMob] = useState(false);
  const [mobileR, setMobileR] = useState(150);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsMob(window.innerWidth < 1024);
      setMobileR(Math.min(window.innerWidth * 0.36, 170));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!isMob) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      setAngle((a) => (a + 2 * dt) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMob]);

  if (isMob) {
    return (
      <div className="relative mx-auto" style={{ width: mobileR * 2 + 90, maxWidth: '100%', height: mobileR * 2 * M_RY + 190 }}>
        {M_ORBITS.map((o, k) => (
          <div key={k} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber/25" style={{ width: mobileR * 2 * o, height: mobileR * 2 * o * M_RY }} />
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 sun-glow rounded-full overflow-hidden" style={{ width: 100, height: 100 }}>
          <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
          <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
        </div>
        {vacancies.map((v, i) => {
          const rad = ((M_PHASES[i] + angle) * Math.PI) / 180;
          const x = Math.cos(rad) * mobileR * M_ORBITS[i % 4];
          const y = Math.sin(rad) * mobileR * M_ORBITS[i % 4] * M_RY;
          const depth = (Math.sin(rad) + 1) / 2;
          const scale = 0.85 + depth * 0.3;
          const z = Math.sin(rad) > 0 ? 30 : 10;
          return (
            <div key={v} className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + scale + ')', zIndex: z, opacity: 0.75 + depth * 0.25 }}>
              <button onClick={() => onApply(v)} className="glass-chip block px-3 py-2 text-[9px] uppercase tracking-wider text-cream/90">
                {v}
                <span className="block text-[8px] normal-case tracking-normal text-amber/90 mt-0.5">Заполнить анкету →</span>
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  const W = 640;
  const H = 480;
  const R = 215;
  const RY = 0.78;
  const cx = W / 2;
  const cy = H / 2;

  const pos = (i: number) => {
    const s = SPOTS[i % SPOTS.length];
    const rad = (s.a * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * R * s.r, y: cy + Math.sin(rad) * R * s.r * RY };
  };

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H}>
        {vacancies.map((v, i) => {
          const p = pos(i);
          return (
            <line key={v} x1={cx} y1={cy} x2={p.x} y2={p.y}
              stroke={hover === i ? 'rgba(194,160,118,0.9)' : 'rgba(194,160,118,0.28)'} strokeWidth="1" style={{ transition: 'stroke 0.3s' }} />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 sun-glow rounded-full overflow-hidden" style={{ width: 160, height: 160 }}>
        <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
        <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
      </div>
      {vacancies.map((v, i) => {
        const p = pos(i);
        return (
          <div key={v} className="absolute" style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%)', zIndex: 20 }}>
            <button onClick={() => onApply(v)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              className="group glass-chip bubble-float block px-6 py-4 text-xs uppercase tracking-wider text-cream/90"
              style={{ animationDelay: (i * 0.55) + 's' }}>
              {v}
              <span className="block text-[9px] normal-case tracking-normal text-amber/90 mt-1">Заполнить анкету →</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
