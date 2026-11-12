import { useEffect, useRef, useState } from 'react';

export function nyActive() {
  if (typeof window === 'undefined') return false;
  const q = new URLSearchParams(window.location.search).get('ny');
  if (q === '1') return true;
  if (q === '0') return false;
  const n = new Date(); const m = n.getMonth(); const d = n.getDate();
  return (m === 10 && d >= 25) || m === 11 || (m === 0 && d <= 15);
}

function Snow({ off }: { off: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (off) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, raf = 0, running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type F = { x: number; y: number; r: number; s: number; p: number; o: number };
    let flakes: F[] = [];
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(110, Math.max(36, Math.floor(w / 14)));
      flakes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 1.9, s: 0.35 + Math.random() * 0.9, p: Math.random() * Math.PI * 2, o: 0.18 + Math.random() * 0.3 }));
    };
    resize();
    let last = performance.now();
    const tick = (t: number) => {
      if (!running) return;
      const dt = Math.min(50, t - last) / 16.7; last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#F7F3EA';
      for (const f of flakes) {
        f.y += f.s * dt * (0.6 + f.r * 0.35);
        f.p += 0.008 * dt;
        f.x += Math.sin(f.p) * 0.3 * dt + 0.06 * dt;
        if (f.y > h + 4) { f.y = -6; f.x = Math.random() * w; }
        if (f.x > w + 6) f.x = -6;
        ctx.globalAlpha = f.o;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const vis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', vis);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', vis); };
  }, [off]);
  if (off) return null;
  return <canvas ref={ref} className="fixed inset-0 z-40 pointer-events-none" aria-hidden="true" />;
}

function Sprig({ flip = false }: { flip?: boolean }) {
  const pts = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return { x: 16 + t * 150, y: 10 + t * 112, a: 40 + t * 12 }; });
  const baubles = [{ x: 66, y: 62, r: 7, c: '#C0392B' }, { x: 112, y: 96, r: 6, c: '#D9A441' }, { x: 148, y: 128, r: 5, c: '#C0392B' }];
  return (
    <svg viewBox="0 0 200 170" className="w-full h-auto" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path d="M12 6 C 60 38, 118 82, 172 128" stroke="#3E7A5C" strokeWidth="3" fill="none" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`} stroke={i % 2 ? '#2E6B4F' : '#3E7A5C'} strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M0 0 L-24 8 M0 0 L-20 16 M0 0 L-12 22 M0 0 L24 8 M0 0 L20 16 M0 0 L12 22" />
        </g>
      ))}
      {baubles.map((b, i) => (
        <g key={i} className="ny-bauble" style={{ animationDelay: `${i * 0.7}s` }}>
          <line x1={b.x} y1={b.y - 14} x2={b.x} y2={b.y - b.r - 2} stroke="#D9A441" strokeWidth="1" />
          <rect x={b.x - 2} y={b.y - b.r - 4} width="4" height="4" rx="1" fill="#D9A441" />
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} />
          <circle cx={b.x - b.r / 3} cy={b.y - b.r / 3} r={b.r / 3.5} fill="#F7F3EA" opacity=".55" />
        </g>
      ))}
      {[[40, 30], [88, 66], [134, 104], [164, 124]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#FFD98A" className="ny-light" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </svg>
  );
}

function Tree() {
  return (
    <svg viewBox="0 0 120 140" className="w-24 h-28 md:w-28 md:h-32 flex-shrink-0" aria-hidden="true">
      <polygon points="60,6 30,52 90,52" fill="#2E6B4F" />
      <polygon points="60,30 24,84 96,84" fill="#275C44" />
      <polygon points="60,58 16,116 104,116" fill="#1E4A36" />
      <rect x="54" y="116" width="12" height="14" rx="2" fill="#6B4A2B" />
      <path d="M60 0 l3.5 7 7.5 1 -5.5 5.4 1.3 7.6 -6.8-3.6 -6.8 3.6 1.3-7.6 -5.5-5.4 7.5-1z" fill="#D9A441" />
      <path d="M30 52 Q60 62 90 52 M24 84 Q60 96 96 84" stroke="#D9A441" strokeWidth="1.2" fill="none" opacity=".6" />
      {[[48, 44, '#C0392B'], [72, 66, '#D9A441'], [40, 86, '#D9A441'], [78, 96, '#C0392B'], [58, 104, '#F7F3EA']].map(([x, y, c], i) => (
        <circle key={i} cx={x as number} cy={y as number} r="3.4" fill={c as string} className="ny-light" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </svg>
  );
}

export function NewYearBanner() {
  if (!nyActive()) return null;
  return (
    <section className="relative z-10 px-6 lg:px-12 max-w-[1400px] mx-auto pt-10">
      <div className="ny-banner relative overflow-hidden rounded-2xl border border-amber/30 px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row items-center gap-6">
        <Tree />
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-amber mb-2">Новый год · 2027</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-cream mb-2">Праздник со вкусом истории</h2>
          <p className="text-cream/70 font-light">Открыта бронь новогодних банкетов и корпоративов во всех четырёх ресторанах. Даты до 31 декабря разбирают быстро.</p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
          <a href="#restaurants" className="btn-terra px-6 py-3 text-xs uppercase tracking-widest text-center">Выбрать ресторан</a>
          <a href="tel:+78002015757" className="px-6 py-3 text-xs uppercase tracking-widest text-center border border-cream/25 rounded-full text-cream/80 hover:text-cream transition-colors">8 800 201-57-57</a>
        </div>
      </div>
    </section>
  );
}

export default function NewYear() {
  const [off, setOff] = useState(() => localStorage.getItem('iv-ny-off') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!nyActive()) return null;
  const toggle = () => setOff(v => { localStorage.setItem('iv-ny-off', v ? '0' : '1'); return !v; });
  return (
    <div className={off ? 'ny-off' : ''}>
      <Snow off={off} />
      <div className="fixed top-0 left-0 z-40 w-[130px] md:w-[200px] pointer-events-none opacity-90"><Sprig /></div>
      <div className="fixed top-0 right-0 z-40 w-[130px] md:w-[200px] pointer-events-none opacity-90"><Sprig flip /></div>
      <button onClick={toggle} aria-pressed={!off} title={off ? 'Включить новогоднюю анимацию' : 'Выключить новогоднюю анимацию'} className="fixed bottom-6 left-6 z-50 glass-bar rounded-full w-11 h-11 flex items-center justify-center text-cream/80 hover:text-cream transition-colors relative">
        <span className={'text-lg leading-none ' + (off ? 'opacity-40' : '')}>❄</span>
        {off && <span className="absolute w-6 h-[1.5px] bg-cream/70 rotate-45 rounded-full" />}
      </button>
    </div>
  );
}
