import { useEffect, useRef, useState } from 'react';
import { suppliers, Supplier } from '../data/suppliers';
import { holdingBrand } from '../data/holding';
import BrandImg from './BrandImg';

interface Props { onPartner: () => void; }

const RY = 0.34;
const RING_K = [1, 0.9, 0.8, 0.7, 0.6, 0.5];
const SPEEDS = [5, -4, 6, -5, 7, -6];
const PHASES = [20, 120, 220, 60, 170, 300];

const M_ORBITS = [1, 0.8, 0.62, 0.46];
const M_RY = 0.42;

const sizeFor = (name: string) => Math.round(Math.min(104, Math.max(64, 44 + name.length * 2.2)));

export default function SuppliersOrbit({ onPartner }: Props) {
  const [t, setT] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [w, setW] = useState(1280);
  const pausedRef = useRef(false);
  const cur = useRef(0);
  const hideTimer = useRef<any>(null);

  useEffect(() => {
    const update = () => setW(Math.min(1280, window.innerWidth - 40));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const show = (id: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    pausedRef.current = true;
    setHover(id);
  };
  const hideSoon = () => {
    hideTimer.current = setTimeout(() => {
      pausedRef.current = false;
      setHover(null);
    }, 250);
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const target = pausedRef.current ? 0.25 : 1;
      cur.current += (target - cur.current) * 0.04;
      setT((x) => x + cur.current * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isMob = w < 1024;

  const tooltip = (s: Supplier) => (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 glass-bar rounded-2xl p-4 text-left z-50"
      onMouseEnter={() => show(s.id)} onMouseLeave={hideSoon}>
      <p className="text-[9px] uppercase tracking-[0.25em] text-amber mb-1.5">{s.category}</p>
      <p className="text-xs text-cream/80 font-light leading-relaxed mb-2">{s.desc}</p>
      {s.site && (
        <a href={s.site} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.2em] text-amber border-b border-amber/40 pb-0.5 hover:text-cream hover:border-cream transition-colors">
          На сайт ↗
        </a>
      )}
    </div>
  );

  if (isMob) {
    const mobileR = (w + 40) * 0.62;
    return (
      <div className="relative mx-auto" style={{ width: mobileR * 2 + 90, maxWidth: '100%', height: mobileR * 2 * M_RY + 190 }}>
        {M_ORBITS.map((o, k) => (
          <div key={k} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber/25" style={{ width: mobileR * 2 * o, height: mobileR * 2 * o * M_RY }} />
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 sun-glow rounded-full overflow-hidden" style={{ width: 120, height: 120 }}>
          <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
          <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
        </div>
        {suppliers.map((s, i) => {
          const deg = PHASES[i % PHASES.length] + Math.floor(i / 4) * 180 + t * SPEEDS[i % SPEEDS.length];
          const rad = (deg * Math.PI) / 180;
          const x = Math.cos(rad) * mobileR * M_ORBITS[i % 4];
          const y = Math.sin(rad) * mobileR * M_ORBITS[i % 4] * M_RY;
          const depth = (Math.sin(rad) + 1) / 2;
          const scale = 0.85 + depth * 0.3;
          const z = Math.sin(rad) > 0 ? 30 : 10;
          return (
            <div key={s.id} className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + scale + ')', zIndex: z, opacity: 0.75 + depth * 0.25 }}
              onMouseEnter={() => show(s.id)} onMouseLeave={hideSoon}>
              <div className="flex flex-col items-center gap-1 w-16">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-cream/20" style={{ boxShadow: '0 0 20px ' + s.accent + '66' }}>
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-coal flex items-center justify-center">
                      <span className="px-1 text-center leading-tight font-semibold text-cream/85 break-words" style={{ fontSize: 8 }}>{s.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full sphere-shade pointer-events-none" />
                </div>
                <span className="text-[8px] font-semibold text-cream/85 text-center leading-tight break-words w-full">{s.name}</span>
              </div>
            </div>
          );
        })}
        {(() => {
          const deg = PHASES[0] + 90 + t * SPEEDS[0];
          const rad = (deg * Math.PI) / 180;
          const x = Math.cos(rad) * mobileR * M_ORBITS[2];
          const y = Math.sin(rad) * mobileR * M_ORBITS[2] * M_RY;
          const depth = (Math.sin(rad) + 1) / 2;
          return (
            <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + (0.85 + depth * 0.3) + ')', zIndex: Math.sin(rad) > 0 ? 30 : 10, opacity: 0.75 + depth * 0.25 }}>
              <button onClick={onPartner} className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 32% 28%, #EBD3A8, #C2A076 55%, #8A6F4D)', boxShadow: '0 0 24px rgba(194,160,118,0.55)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E0D0B" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="text-[8px] font-semibold text-amber">Стать партнёром</span>
              </button>
            </div>
          );
        })()}
      </div>
    );
  }

  const W = w;
  const R1 = W / 2 - 70;
  const H = Math.round(R1 * RY * 2 + 140);
  const cx = W / 2;
  const cy = H / 2;
  const RINGS = RING_K.map((k, i) => ({ R: R1 * k, speed: SPEEDS[i], phase: PHASES[i] }));

  const place = (deg: number, R: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * R, y: cy + Math.sin(rad) * R * RY, depth: (Math.sin(rad) + 1) / 2 };
  };

  const bubble = (s: Supplier, deg: number, ring: number, key: string) => {
    const p = place(deg, RINGS[ring].R);
    const size = sizeFor(s.name);
    return (
      <div key={key} className="absolute" style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%) scale(' + (0.8 + p.depth * 0.3) + ')', zIndex: p.depth > 0.5 ? 30 : 10, opacity: 0.7 + p.depth * 0.3 }}
        onMouseEnter={() => show(s.id)} onMouseLeave={hideSoon}>
        <div className="relative flex flex-col items-center gap-1.5 w-32">
          {hover === s.id && tooltip(s)}
          <div className="relative rounded-full overflow-hidden border border-cream/20" style={{ width: size, height: size, boxShadow: '0 0 40px ' + s.accent + '66, 0 14px 34px rgba(0,0,0,0.5)' }}>
            {s.logo ? (
              <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-coal flex items-center justify-center">
                <span className="px-2 text-center leading-tight font-semibold text-cream/85 break-words" style={{ fontSize: size > 96 ? 11 : 12 }}>{s.name}</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full sphere-shade pointer-events-none" />
          </div>
          <span className="text-[10px] font-semibold text-cream/85 text-center leading-tight break-words w-full">{s.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H} style={{ overflow: 'visible' }}>
        {RINGS.map((r, i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r.R} ry={r.R * RY} fill="none" stroke="rgba(194,160,118,0.35)" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 sun-glow rounded-full overflow-hidden" style={{ width: 170, height: 170 }}>
        <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
        <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
      </div>
      <svg className="absolute inset-0 z-[25] pointer-events-none" width={W} height={H} style={{ overflow: 'visible' }}>
        {RINGS.map((r, i) => (
          <path key={i} d={'M ' + (cx - r.R) + ' ' + cy + ' A ' + r.R + ' ' + (r.R * RY) + ' 0 0 0 ' + (cx + r.R) + ' ' + cy} fill="none" stroke="rgba(194,160,118,0.5)" strokeWidth="1.5" />
        ))}
      </svg>
      {suppliers.map((s, i) => {
        const ring = RINGS[i % RINGS.length];
        const deg = ring.phase + Math.floor(i / RINGS.length) * 180 + t * ring.speed;
        return bubble(s, deg, i % RINGS.length, s.id);
      })}
      {(() => {
        const ring = RINGS[suppliers.length % RINGS.length];
        const deg = ring.phase + 90 + t * ring.speed;
        const p = place(deg, ring.R);
        return (
          <div className="absolute" style={{ left: p.x, top: p.y, transform: 'translate(-50%,-50%) scale(' + (0.8 + p.depth * 0.3) + ')', zIndex: p.depth > 0.5 ? 30 : 10, opacity: 0.75 + p.depth * 0.25 }}
            onMouseEnter={() => (pausedRef.current = true)} onMouseLeave={() => (pausedRef.current = false)}>
            <button onClick={onPartner} className="flex flex-col items-center gap-1.5 group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'radial-gradient(circle at 32% 28%, #EBD3A8, #C2A076 55%, #8A6F4D)', boxShadow: '0 0 44px rgba(194,160,118,0.55), 0 10px 26px rgba(0,0,0,0.5)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E0D0B" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-amber">Стать партнёром</span>
            </button>
          </div>
        );
      })()}
    </div>
  );
}
