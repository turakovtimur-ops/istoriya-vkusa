import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { restaurants, holdingBrand } from '../data/holding';
import { RESTO_EXTRA } from '../data/resto-extra';
import BrandImg from './BrandImg';

interface Star { top: number; left: number; size: number; delay: number; }

const ORBITS = [
  { r: 1, ry: 1 },
  { r: 0.78, ry: 0.78 },
  { r: 0.58, ry: 0.58 },
  { r: 0.4, ry: 0.4 },
];
const M_ORBITS = [1, 0.8, 0.62, 0.46];
const M_RY = 0.42;
const PHASES = [45, 135, 225, 315];
const SPEED = 4;

export default function OrbitHero() {
  const [dims, setDims] = useState({ R: 600, ryF: 0.3 });
  const [mobileR, setMobileR] = useState(150);
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const pausedRef = useRef<number | null>(null);
  const curSpeed = useRef(0);
  const frame = useRef(0);
  const angleRef = useRef(0);
  const satRef = useRef(0);
  const visibleRef = useRef(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const planetRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const satRefsList = useRef<(HTMLAnchorElement | null)[]>([]);

  const SATS = useMemo(
    () => restaurants
      .map((r, i) => ({ i, name: r.name, url: (RESTO_EXTRA[r.id] && RESTO_EXTRA[r.id].eda) || '' }))
      .filter((s) => s.url !== ''),
    []
  );

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 90 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
      })),
    []
  );

  const apply = () => {
    const w = window.innerWidth;
    const mob = w < 768;
    const angle = angleRef.current;
    const satA = satRef.current;
    const R = dims.R;
    const ryF = dims.ryF;
    const mR = mobileR;
    restaurants.forEach((r, i) => {
      const el = planetRefs.current[i];
      if (!el) return;
      const rad = ((PHASES[i] + angle) * Math.PI) / 180;
      const depth = (Math.sin(rad) + 1) / 2;
      if (mob) {
        const x = Math.cos(rad) * mR * M_ORBITS[i];
        const y = Math.sin(rad) * mR * M_ORBITS[i] * M_RY;
        const scale = 0.85 + depth * 0.3;
        el.style.transform = 'translate(-50%, -50%) translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
        el.style.zIndex = String(Math.sin(rad) > 0 ? 30 : 10);
        el.style.opacity = String(0.75 + depth * 0.25);
      } else {
        const x = Math.cos(rad) * R * ORBITS[i].r;
        const y = Math.sin(rad) * R * ryF * ORBITS[i].ry;
        const scale = 0.7 + depth * 0.4;
        el.style.transform = 'translate(-50%, -50%) translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
        el.style.zIndex = String(Math.sin(rad) > 0 ? 30 : 10);
        el.style.opacity = String(0.7 + depth * 0.3);
      }
    });
    SATS.forEach((s, j) => {
      const el = satRefsList.current[j];
      if (!el) return;
      const rad = ((PHASES[s.i] + angle) * Math.PI) / 180;
      const srad = ((satA + 90 + j * 137) * Math.PI) / 180;
      const depth = (Math.sin(rad) + 1) / 2;
      const front = Math.sin(srad) > 0;
      if (mob) {
        const px = Math.cos(rad) * mR * M_ORBITS[s.i];
        const py = Math.sin(rad) * mR * M_ORBITS[s.i] * M_RY;
        const x = px + Math.cos(srad) * 46;
        const y = py - 6 + Math.sin(srad) * 24;
        el.style.transform = 'translate(-50%, -50%) translate(' + x + 'px, ' + y + 'px)';
        el.style.zIndex = String(front ? 35 : 9);
      } else {
        const kscale = 0.7 + depth * 0.4;
        const px = Math.cos(rad) * R * ORBITS[s.i].r;
        const py = Math.sin(rad) * R * ryF * ORBITS[s.i].ry;
        const x = px + Math.cos(srad) * 96 * kscale;
        const y = py - 46 * kscale + Math.sin(srad) * 48 * kscale;
        el.style.transform = 'translate(-50%, -50%) translate(' + x + 'px, ' + y + 'px) scale(' + kscale * (front ? 1 : 0.82) + ')';
        el.style.zIndex = String(front ? 35 : 9);
        el.style.opacity = String(0.75 + depth * 0.25);
      }
    });
  };

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const R = Math.max(280, Math.min(w * 0.44, w / 2 - 130, (h - 340) / 1.1, 1100));
      const ryF = Math.min(0.42, Math.max(0.16, (h - 560) / 2 / R));
      setDims({ R, ryF });
      setMobileR(Math.min(w * 0.36, 170));
      setIsMobile(w < 768);
      setTimeout(apply, 0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useLayoutEffect(() => { apply(); }, [isMobile, dims, mobileR]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visibleRef.current && !document.hidden) {
        const target = pausedRef.current !== null ? SPEED * 0.25 : window.innerWidth < 768 ? SPEED * 0.5 : SPEED;
        curSpeed.current += (target - curSpeed.current) * 0.06;
        angleRef.current = (angleRef.current + curSpeed.current * dt) % 360;
        satRef.current = (satRef.current + curSpeed.current * 5 * dt) % 360;
        frame.current += 1;
        if (frame.current % 2 === 0) apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { visibleRef.current = es[0].isIntersecting; }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (wrapRef.current) wrapRef.current.style.transform = 'perspective(1600px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 10) + 'deg)';
  };

  const { R, ryF } = dims;
  const sunSize = R < 400 ? 170 : R < 700 ? 200 : 230;
  const svgW = R * 2 + 4;
  const svgH = R * ryF * 2 + 4;
  const cx = R + 2;
  const cy = R * ryF + 2;

  return (
    <section
      ref={sectionRef}
      className={'relative overflow-hidden bg-night ' + (isMobile ? 'lg:min-h-screen flex flex-col pt-32 pb-4' : 'h-screen flex flex-col pt-24 md:pt-28 pb-4')}
      onMouseMove={onMove}
      onMouseLeave={() => { if (wrapRef.current) wrapRef.current.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg)'; }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-cream/60 star-twinkle"
            style={{ top: s.top + '%', left: s.left + '%', width: s.size, height: s.size, animationDelay: s.delay + 's' }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 pb-1 md:pb-2">
        <p className="text-amber text-[10px] md:text-xs tracking-[0.4em] uppercase mb-3 font-medium">Ресторанный холдинг</p>
        <p className="text-[min(6vw,30px)] md:text-5xl lg:text-6xl font-semibold tracking-tighter text-cream whitespace-nowrap">Одна история — четыре вкуса</p>
        <p className="text-cream/60 font-light text-[min(3.9vw,18px)] md:text-xl mt-4 whitespace-nowrap">Ты непременно станешь частью нашей истории</p>
      </div>

      {isMobile ? (
        <div className="relative z-10 flex-1 flex items-center justify-center py-6">
          <div className="relative" style={{ width: mobileR * 2 + 90, maxWidth: '100%', height: mobileR * 2 * M_RY + 150 }}>
            {M_ORBITS.map((o, k) => (
              <div
                key={k}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber/25"
                style={{ width: mobileR * 2 * o, height: mobileR * 2 * o * M_RY }}
              />
            ))}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 sun-glow rounded-full overflow-hidden" style={{ width: 100, height: 100 }}>
              <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
              <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
            </div>
            {restaurants.map((r, i) => (
              <a
                key={r.id}
                ref={(el) => { planetRefs.current[i] = el; }}
                href={r.path}
                className="absolute left-1/2 top-1/2 planet" style={{ willChange: 'transform' }}
              >
                <div className="flex flex-col items-center gap-1.5 w-20">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden" style={{ boxShadow: '0 0 26px ' + r.accent + '66' }}>
                    <BrandImg src={r.roundLogo ? r.roundLogo : r.logo} alt={r.name} fallback={r.name} color={r.accent} fit={r.roundLogo ? 'cover' : 'contain'} className={r.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-1.5'} />
                    <div className="absolute inset-0 rounded-full sphere-shade pointer-events-none" />
                  </div>
                </div>
              </a>
            ))}
            {SATS.map((s, j) => (
              <a
                key={'sat-' + s.i}
                ref={(el) => { satRefsList.current[j] = el; }}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name + ' — доставка в Яндекс Еде'}
                className="absolute left-1/2 top-1/2 eda-satellite" style={{ willChange: 'transform' }}
              >
                <img src="/images/kinza/yandex-eda.webp" alt="" className="w-9 h-9 rounded-[22%] eda-logo" style={{ boxShadow: '0 0 18px rgba(255,214,10,0.5)' }} />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex-1 flex items-center justify-center pb-14 md:pb-16">
          <div
            ref={wrapRef}
            className="relative"
            style={{
              width: R * 2 + 320,
              height: R * ryF * 2 + 280,
              transition: 'transform 0.5s ease-out',
            }}
          >
            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width={svgW} height={svgH} style={{ overflow: 'visible' }}>
              {ORBITS.map((o, i) => (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={R * o.r}
                  ry={R * ryF * o.ry}
                  fill="none"
                  stroke={active === i ? restaurants[i].accent : 'rgba(194,160,118,0.4)'}
                  strokeOpacity={active === i ? 0.9 : 1}
                  strokeWidth="1.5"
                  style={{ transition: 'stroke 0.4s' }}
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 sun-glow rounded-full overflow-hidden" style={{ width: sunSize, height: sunSize }}>
              <BrandImg src={holdingBrand.roundLogo} alt={holdingBrand.name} fallback={'История Вкуса'} color={holdingBrand.blue} fit="cover" className="w-full h-full scale-[1.08]" />
              <div className="absolute inset-0 rounded-full sphere-shade-sun pointer-events-none" />
            </div>

            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[25] pointer-events-none" width={svgW} height={svgH} style={{ overflow: 'visible' }}>
              {ORBITS.map((o, i) => {
                const rx = R * o.r;
                const ry = R * ryF * o.ry;
                return (
                  <path
                    key={i}
                    d={'M ' + (cx - rx) + ' ' + cy + ' A ' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + cy}
                    fill="none"
                    stroke={active === i ? restaurants[i].accent : 'rgba(194,160,118,0.65)'}
                    strokeWidth="2"
                    style={{ transition: 'stroke 0.4s' }}
                  />
                );
              })}
            </svg>

            {restaurants.map((r, i) => (
              <a
                key={r.id}
                ref={(el) => { planetRefs.current[i] = el; }}
                href={r.path}
                className="absolute left-1/2 top-1/2 planet" style={{ willChange: 'transform' }}
                onMouseEnter={() => { pausedRef.current = i; setActive(i); }}
                onMouseLeave={() => { pausedRef.current = null; setActive(null); }}
              >
                <div className="flex flex-col items-center gap-2 w-48">
                  <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden" style={{ boxShadow: '0 0 50px ' + r.accent + '66, 0 18px 40px rgba(0,0,0,0.5)' }}>
                    <BrandImg src={r.roundLogo ? r.roundLogo : r.logo} alt={r.name} fallback={r.name} color={r.accent} fit={r.roundLogo ? 'cover' : 'contain'} className={r.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-4'} />
                    <div className="absolute inset-0 rounded-full sphere-shade pointer-events-none" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-cream">{r.name}</p>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-cream/50 mt-0.5">{r.cuisine}</p>
                  </div>
                  <span className="glass-chip text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 text-cream/90">
                    Перейти в ресторан
                  </span>
                </div>
              </a>
            ))}
            {SATS.map((s, j) => (
              <a
                key={'sat-' + s.i}
                ref={(el) => { satRefsList.current[j] = el; }}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name + ' — доставка в Яндекс Еде'}
                title="Доставка · Яндекс Еда"
                className="absolute left-1/2 top-1/2 eda-satellite" style={{ willChange: 'transform' }}
              >
                <img src="/images/kinza/yandex-eda.webp" alt="" className="w-12 h-12 lg:w-14 lg:h-14 rounded-[22%] eda-logo" style={{ boxShadow: '0 0 26px rgba(255,214,10,0.5), 0 8px 20px rgba(0,0,0,0.45)' }} />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
        <span className="text-cream/40 text-[9px] tracking-[0.3em] uppercase">Листайте</span>
        <div className="w-px h-6 bg-cream/25 animate-pulse" />
      </div>
    </section>
  );
}
