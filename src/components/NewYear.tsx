import { useEffect, useRef, useState } from 'react';

export function nyActive() {
  if (typeof window === 'undefined') return false;
  const q = new URLSearchParams(window.location.search).get('ny');
  if (q === '1') return true;
  if (q === '0') return false;
  const n = new Date(); const m = n.getMonth(); const d = n.getDate();
  return m === 10 || m === 11 || (m === 0 && d <= 20);
}

/* ---------- прелоадер: коза 2027 ---------- */
function GoatLoader() {
  const [down, setDown] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      if (!alive) return;
      setDown(false);
      timers.push(setTimeout(() => {
        if (!alive) return;
        setDown(true);
        timers.push(setTimeout(cycle, 280));
      }, 560));
    };
    cycle();
    timers.push(setTimeout(() => setHiding(true), 3400));
    timers.push(setTimeout(() => setGone(true), 4300));
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);
  if (gone) return null;
  return (
    <div className={'ny-loader' + (hiding ? ' hide' : '')}>
      <div className="ny-year">2027</div>
      <div className={'ny-stage' + (down ? ' down' : '')}>
        <img className={'ny-frame ny-f-up' + (down ? '' : ' on')} src="/images/goat-up.png" alt="" />
        <img className={'ny-frame ny-f-down' + (down ? ' on' : '')} src="/images/goat-down.png" alt="" />
        <span className="ny-dust d1" />
        <span className="ny-dust d2" />
        <span className="ny-dust d3" />
      </div>
      <div className="ny-capline">С Новым годом! · Год Козы</div>
    </div>
  );
}

/* ---------- трёхслойный снег ---------- */
function Snow() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, raf = 0, running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type F = { x: number; y: number; r: number; s: number; o: number; p: number };
    let flakes: F[] = [];
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = [];
      const layers = [
        { n: 26, r: [2.2, 3.4], s: [1.0, 1.6], o: [0.5, 0.8] },
        { n: 40, r: [1.3, 2.2], s: [0.6, 1.0], o: [0.3, 0.5] },
        { n: 60, r: [0.6, 1.3], s: [0.3, 0.6], o: [0.15, 0.3] },
      ];
      layers.forEach((L) => {
        for (let i = 0; i < L.n; i++) {
          flakes.push({ x: Math.random() * w, y: Math.random() * h, r: L.r[0] + Math.random() * (L.r[1] - L.r[0]), s: L.s[0] + Math.random() * (L.s[1] - L.s[0]), o: L.o[0] + Math.random() * (L.o[1] - L.o[0]), p: Math.random() * 6.28 });
        }
      });
    };
    resize();
    let last = performance.now();
    const tick = (t: number) => {
      if (!running) return;
      const dt = Math.min(50, t - last) / 16.7; last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#F7F3EA';
      for (const f of flakes) {
        f.y += f.s * dt; f.p += 0.01 * dt; f.x += Math.sin(f.p) * 0.35 * dt;
        if (f.y > h + 4) { f.y = -6; f.x = Math.random() * w; }
        if (f.x > w + 6) f.x = -6;
        if (f.x < -6) f.x = w + 6;
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
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-40 pointer-events-none" aria-hidden="true" />;
}

/* ---------- баннер банкетов с обратным отсчётом ---------- */
export function NewYearBanner() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date('2027-01-01T00:00:00+03:00').getTime();
    const tick = () => {
      const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setT({ d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (!nyActive()) return null;
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  return (
    <section className="ny-banner2">
      <div>
        <h3>🎄 Новогодние банкеты — открыта бронь</h3>
        <p>Корпоративы и семейные торжества в любом из четырёх ресторанов. Даты до 31 декабря разбирают быстро — успейте занять свою.</p>
        <div className="ny-cta">
          <a href="#restaurants" className="btn-terra">Выбрать ресторан</a>
          <a href="tel:+78002015757" className="ny-ghost">8 800 201-57-57</a>
        </div>
      </div>
      <div className="ny-count">
        <div className="ny-cell"><div className="ny-num">{t.d}</div><div className="ny-capt">дней</div></div>
        <div className="ny-cell"><div className="ny-num">{pad(t.h)}</div><div className="ny-capt">часов</div></div>
        <div className="ny-cell"><div className="ny-num">{pad(t.m)}</div><div className="ny-capt">минут</div></div>
        <div className="ny-cell"><div className="ny-num">{pad(t.s)}</div><div className="ny-capt">секунд</div></div>
      </div>
    </section>
  );
}

/* ---------- корень зимы ---------- */
export default function NewYear() {
  const [off, setOff] = useState(() => localStorage.getItem('iv-ny-off') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const active = nyActive();

  useEffect(() => {
    const on = nyActive() && !off;
    document.body.classList.toggle('ny-winter', on);
    const orn = '<div class="ny-orn" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2M6 12l-2-2M6 12l-2 2M18 12l2-2M18 12l2 2"/></svg></div>';
    ['#team', '#news', '#events'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const prev = el.previousElementSibling;
      const has = !!(prev && prev.classList.contains('ny-orn'));
      if (on && !has) el.insertAdjacentHTML('beforebegin', orn);
      if (!on && has) prev!.remove();
    });
    return () => {
      document.querySelectorAll('.ny-orn').forEach((n) => n.remove());
      document.body.classList.remove('ny-winter');
    };
  }, [off]);

  const toggle = () => setOff((v) => { localStorage.setItem('iv-ny-off', v ? '0' : '1'); return !v; });

  return (
    <div className={off ? 'ny-off' : ''}>
      {active && <GoatLoader />}
      {active && !off && <Snow />}
      {active && !off && <div className="ny-frost" />}
      {active && (
        <button onClick={toggle} aria-pressed={!off} title={off ? 'Включить зимнюю атмосферу' : 'Выключить зимнюю атмосферу'} className="fixed bottom-6 left-6 z-50 glass-bar rounded-full w-11 h-11 flex items-center justify-center text-cream/80 hover:text-cream transition-colors relative">
          <span className={'text-lg leading-none ' + (off ? 'opacity-40' : '')}>❄</span>
          {off && <span className="absolute w-6 h-[1.5px] bg-cream/70 rotate-45 rounded-full" />}
        </button>
      )}
    </div>
  );
}
