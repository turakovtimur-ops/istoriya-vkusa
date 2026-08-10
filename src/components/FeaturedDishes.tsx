import { motion } from 'framer-motion';
import { getFeatured } from '../data/menu';

const dishImages: Record<string, string> = {
  'k1': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85',
  'h1': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=85',
  'z1': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85',
  'z4': 'https://images.unsplash.com/photo-1509385425628-75c309444a94?w=800&q=85',
  'm1': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=85',
  'm2': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=85',
};

export default function FeaturedDishes() {
  const featured = getFeatured().slice(0, 6);
  return (
    <section className="py-24 lg:py-40 bg-cream">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-24 text-center reveal">
          <p className="text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">Фирменные блюда</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-graphite">
            Вкусно. Сочно.<br /><em className="text-forest">По-грузински.</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {featured.map((dish, i) => (
            <motion.div key={dish.id} initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }} className="group">
              <div className="relative aspect-[4/5] overflow-hidden mb-5">
                <img src={dishImages[dish.id] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85'}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl lg:text-3xl font-medium text-graphite">{dish.name}</h3>
                <p className="text-muted text-sm font-light leading-relaxed min-h-[3rem]">{dish.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-graphite/10">
                  <span className="text-xs text-muted uppercase tracking-widest">{dish.weight}</span>
                  {dish.price && <span className="font-serif text-xl text-graphite">{dish.price} ₽</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 lg:mt-24 text-center reveal">
          <a href="#menu" className="btn-primary">Смотреть всё меню</a>
        </div>
      </div>
    </section>
  );
}