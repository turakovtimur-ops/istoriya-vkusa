import { useEffect, useState } from 'react';
import { holdingBrand } from '../data/holding';

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const start = Date.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, 900 - (Date.now() - start));
      setTimeout(() => setHide(true), wait);
      setTimeout(() => setGone(true), wait + 750);
    };
    const t = setTimeout(finish, 2500);
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    return () => { clearTimeout(t); window.removeEventListener('load', finish); };
  }, []);
  if (gone) return null;
  return (
    <div aria-hidden="true" className={'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-graphite transition-opacity duration-700 ' + (hide ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
      <div className="relative w-28 h-28">
        <img src={holdingBrand.roundLogo} alt="" className="absolute inset-2 w-24 h-24 rounded-full object-cover" />
        <svg className="absolute inset-0 w-28 h-28 iv-spin" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r="54" fill="none" stroke="rgba(194,160,118,0.18)" strokeWidth="2" />
          <circle cx="56" cy="56" r="54" fill="none" stroke="#C2A076" strokeWidth="2" strokeLinecap="round" strokeDasharray="339.3" strokeDashoffset="250" />
        </svg>
      </div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-cream/60">Загружаем вкус…</p>
    </div>
  );
}
