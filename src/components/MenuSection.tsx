import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems, menuCategories } from '../data/menu';

const dishImages: Record<string, string> = {
  'k1': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=85',
  'k2': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=85',
  'h1': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=85',
  'h2': 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&q=85',
  'z1': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=85',
  'z2': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=85',
  'z4': 'https://images.unsplash.com/photo-1509385425628-75c309444a94?w=600&q=85',
  's1': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=85',
  's2': 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600&q=85',
  'su1': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=85',
  'su2': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=85',
  'm1': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=85',
  'm2': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=85',
  'm3': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=85',
  'r1': 'https://images.unsplash.com/photo-1535148226109-7d5eddf3b9f3?w=600&q=85',
  'r2': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=85',
  'd1': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=85',
  'd2': 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=85',
  'n1': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=85',
  'n2': 'https://images.unsplash.com/photo-1597318236501-c0dccc1429aa?w=600&q=85',
  'n3': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=85',
};

export default function MenuSection() {
  const [active, setActive] = useState<string>('Все');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const categories = ['Все', ...menuCategories];
  const filtered = active === 'Все' ? menuItems : menuItems.filter(i => i.category === active);

  return (
    <section id="menu" className="py-24 lg:py-40 bg-sand/30">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-16 reveal">
          <p className="text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">Меню</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-graphite">
            Грузинская<br /><em className="text-forest">кухня с характером.</em>
          </h2>
        </div>
        <div className="reveal reveal-delay-1 mb-14 flex flex-wrap gap-2 lg:gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2.5 text-xs lg:text-sm uppercase tracking-wider font-medium transition-all duration-300 border ${
                active === cat ? 'bg-graphite text-cream border-graphite' : 'bg-transparent text-graphite/70 border-graphite/20 hover:border-graphite'
              }`}>{cat}</button>
          ))}
        </div>
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }} className="group cursor-pointer"
                onClick={() => dishImages[item.id] && setLightbox(dishImages[item.id]!)}>
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-sand">
                  <img src={dishImages[item.id] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=85'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <span className="text-cream text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Смотреть</span>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg lg:text-xl font-medium text-graphite mb-1 leading-tight">{item.name}</h3>
                    <p className="text-muted text-sm font-light leading-relaxed line-clamp-2">{item.description}</p>
                    {item.weight && <p className="text-xs text-muted/70 uppercase tracking-wider mt-2">{item.weight}</p>}
                  </div>
                  {item.price && <span className="font-serif text-xl text-graphite whitespace-nowrap pt-1">{item.price} ₽</span>}
                </div>
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
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }} src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
            <button className="absolute top-6 right-6 text-cream" aria-label="Закрыть">
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