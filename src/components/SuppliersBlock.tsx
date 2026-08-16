import { useEffect, useRef } from 'react';
import { suppliers } from '../data/suppliers';
import SuppliersOrbit from './SuppliersOrbit';

// Лента: плывёт сама; при наведении — управление мышью (drag / горизонтальный скролл)
export default function SuppliersBlock({ onPartner }: { onPartner: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);
  const dragRef = useRef({ active: false, x: 0 });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        if (!hoverRef.current && !dragRef.current.active) {
          offsetRef.current -= 40 * dt;
        }
        if (offsetRef.current < -half) offsetRef.current += half;
        if (offsetRef.current > 0) offsetRef.current -= half;
        track.style.transform = 'translateX(' + offsetRef.current + 'px)';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (e: WheelEvent) => {
      if (!hoverRef.current) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault();
      offsetRef.current -= d;
    };
    track.parentElement?.addEventListener('wheel', onWheel, { passive: false });
    return () => track.parentElement?.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section id="suppliers" className="py-8 lg:py-12 bg-coal border-t border-cream/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-5 reveal">
        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Партнёры и поставщики</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4">Те, кто с нами</h2>
        <p className="text-cream/60 font-light max-w-2xl leading-relaxed">
          Кухня, бар, сервис и город. Работаем с теми, кому доверяем сами. Партнёры вращаются вокруг бренда — наведите мышь, чтобы остановить и рассмотреть.
        </p>
      </div>

      <div className="hidden lg:block reveal reveal-delay-1 mb-6">
        <SuppliersOrbit onPartner={onPartner} />
      </div>
      <div
        className="lg:hidden overflow-hidden reveal reveal-delay-1 cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => { hoverRef.current = false; dragRef.current.active = false; }}
        onPointerDown={(e) => { dragRef.current = { active: true, x: e.clientX }; }}
        onPointerMove={(e) => {
          if (!dragRef.current.active) return;
          offsetRef.current += e.clientX - dragRef.current.x;
          dragRef.current.x = e.clientX;
        }}
        onPointerUp={() => (dragRef.current.active = false)}
        onPointerLeave={() => (dragRef.current.active = false)}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-6 pr-6" aria-hidden={copy === 1}>
              {suppliers.map((s) => (
                <div key={s.id + '-' + copy} className="w-[280px] flex-none border border-cream/10 bg-night p-6 hover:border-cream/30 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.accent }} />
                    <span className="text-[9px] uppercase tracking-[0.25em] text-cream/40">{s.category}</span>
                  </div>
                  <p className="text-xl font-semibold tracking-tight mb-1.5">{s.name}</p>
                  <p className="text-cream/50 text-xs font-light leading-relaxed">{s.desc}</p>
                </div>
              ))}
              <div className="w-[280px] flex-none border border-amber/40 bg-amber/10 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-amber mb-4">Сотрудничество</p>
                  <p className="text-xl font-semibold tracking-tight mb-2">Стать партнёром</p>
                  <p className="text-cream/60 text-xs font-light leading-relaxed">
                    Разместим ваш бренд на площадке холдинга. Реклама за товар или на специальных условиях. Пришлите прайс или презентацию.
                  </p>
                </div>
                <button onClick={onPartner} className="mt-5 text-xs uppercase tracking-[0.2em] text-amber border-b border-amber/40 pb-1 self-start hover:text-cream hover:border-cream transition-colors">
                  Оставить заявку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}