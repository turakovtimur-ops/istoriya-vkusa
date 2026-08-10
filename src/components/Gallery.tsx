import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages } from '../data/gallery';

const filters = ['all', 'restaurant', 'dishes', 'sea', 'team', 'guests'] as const;
const labels: Record<string, string> = { all:'Всё', restaurant:'Ресторан', dishes:'Блюда', sea:'Море', team:'Команда', guests:'Гости' };

export default function Gallery() {
  const [filter, setFilter] = useState<typeof filters[number]>('all');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const filtered = filter === 'all' ? galleryImages : galleryImages.filter(i => i.category === filter);

  const getSpanClasses = (span?: string) => {
    switch (span) {
      case 'full': return 'col-span-2 md:col-span-3 row-span-2';
      case 'large': return 'col-span-2 md:col-span-2 row-span-2';
      case 'medium': return 'col-span-1 md:col-span-2 row-span-1';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <section id="gallery" className="py-24 lg:py-40 bg-cream">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-16 reveal">
          <p className="text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">Галерея</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-graphite mb-8">
            Атмосфера<br /><em className="text-forest">в деталях.</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all duration-300 border ${
                  filter === f ? 'bg-graphite text-cream border-graphite' : 'bg-transparent text-graphite/70 border-graphite/20 hover:border-graphite'
                }`}>{labels[f]}</button>
            ))}
          </div>
        </div>
        <motion.div layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-[200px] md:auto-rows-[260px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((img) => (
              <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                onClick={() => setLightbox(img.src)}
                className={`relative overflow-hidden cursor-zoom-in ${getSpanClasses(img.span)}`}>
                <img src={img.src} alt={img.alt}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-[1500ms]" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out">
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
            <button className="absolute top-6 right-6 text-cream">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}