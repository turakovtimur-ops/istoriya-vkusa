import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reviews } from '../data/reviews';

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth >= 1024) setVisible(3);
      else if (window.innerWidth >= 768) setVisible(2);
      else setVisible(1);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const maxIndex = Math.max(0, reviews.length - visible);

  return (
    <section id="reviews" className="py-24 lg:py-40 bg-cream">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="reveal">
            <p className="text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">Отзывы гостей</p>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-graphite">
              Настоящие<br /><em className="text-forest">мнения.</em>
            </h2>
          </div>
          <div className="reveal reveal-delay-1 flex gap-3">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
              className="w-14 h-14 border border-graphite/30 hover:bg-graphite hover:text-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center" aria-label="Назад">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button onClick={() => setCurrent(Math.min(maxIndex, current + 1))} disabled={current === maxIndex}
              className="w-14 h-14 border border-graphite/30 hover:bg-graphite hover:text-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center" aria-label="Вперёд">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <motion.div className="flex gap-6 lg:gap-10"
            animate={{ x: `-${current * (100 / visible + (visible > 1 ? 2 : 0))}%` }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}>
            {reviews.map((review) => (
              <div key={review.id} className="flex-none"
                style={{ width: `calc(${100 / visible}% - ${(visible - 1) * (visible > 2 ? 10 : 6) / visible}px)` }}>
                <div className="h-full border border-graphite/10 p-8 lg:p-10 hover:border-graphite/30 transition-colors">
                  <svg className="text-terra mb-8" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                  <p className="text-graphite text-lg lg:text-xl font-light leading-relaxed mb-8 min-h-[120px]">{review.text}</p>
                  <div className="pt-6 border-t border-graphite/10">
                    <p className="font-serif text-xl text-graphite">{review.author}</p>
                    {review.date && <p className="text-xs text-muted uppercase tracking-widest mt-1">{review.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="mt-12 text-center">
          <a href="https://www.istoriya-vkusa.ru/kinza/gbook/" target="_blank" rel="noopener noreferrer" className="btn-primary">Все отзывы</a>
        </div>
      </div>
    </section>
  );
}