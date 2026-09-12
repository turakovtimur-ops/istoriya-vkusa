import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isAdmin = () => (location.hash || '').includes('upravlenie');
    const refresh = () => setOn(fine && !reduced && !isAdmin());
    refresh();
    window.addEventListener('hashchange', refresh);
    if (!fine || reduced) return () => window.removeEventListener('hashchange', refresh);
    document.documentElement.classList.add('iv-nocursor');
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2, x = rx, y = ry, sc = 1, tsc = 1, raf = 0;
    const show = (v: string) => { if (dot.current) dot.current.style.opacity = v; if (ring.current) ring.current.style.opacity = v; };
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      tsc = t.closest('input,textarea,select') ? 0.7 : (t.closest('a,button,[role="button"],summary') ? 1.5 : 1);
      show('1');
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; sc += (tsc - sc) * 0.16;
      if (dot.current) dot.current.style.transform = 'translate(' + (x - 3) + 'px,' + (y - 3) + 'px)';
      if (ring.current) ring.current.style.transform = 'translate(' + (rx - 18) + 'px,' + (ry - 18) + 'px) scale(' + sc + ')';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', move);
    const leave = () => show('0');
    const enter = () => show('1');
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('hashchange', refresh);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('iv-nocursor');
    };
  }, []);
  if (!on) return null;
  return (
    <>
      <div ref={dot} style={{ position: 'fixed', top: 0, left: 0, width: 6, height: 6, background: '#C2A076', borderRadius: 9999, pointerEvents: 'none', zIndex: 999999, opacity: 0, boxShadow: '0 0 8px rgba(194,160,118,.8)' }} />
      <div ref={ring} style={{ position: 'fixed', top: 0, left: 0, width: 36, height: 36, border: '1.5px solid rgba(194,160,118,.75)', borderRadius: 9999, pointerEvents: 'none', zIndex: 999999, opacity: 0, boxShadow: '0 0 14px rgba(194,160,118,.35)', background: 'rgba(194,160,118,.06)' }} />
    </>
  );
}
