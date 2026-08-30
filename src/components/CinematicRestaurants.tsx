import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { restaurants, HoldingRestaurant } from '../data/holding';
import BrandImg from './BrandImg';

function Scene({ r, left, right }: { r: HoldingRestaurant; left: HoldingRestaurant; right: HoldingRestaurant }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Нырок в планету
  const dive = useTransform(scrollYProgress, [0.25, 0.9], [1, 9]);
  // Заголовок уезжает вверх и гаснет
  const headY = useTransform(scrollYProgress, [0.05, 0.35], [0, -140]);
  const headOp = useTransform(scrollYProgress, [0.05, 0.35], [1, 0]);
  // Боковые планеты гаснут
  const sidesOp = useTransform(scrollYProgress, [0.05, 0.3], [1, 0]);
  // Поверхность (паттерн) проявляется
  const surfOp = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  // Текст на поверхности
  const textOp = useTransform(scrollYProgress, [0.68, 0.92], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.68, 0.92], [60, 0]);

  return (
    <div ref={ref} className="relative" style={{ height: '240vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Боковые планеты-соседи */}
        <motion.div
          style={{ opacity: sidesOp }}
          className="absolute inset-x-0 top-[50%] flex items-center justify-between px-4 md:px-10 pointer-events-none z-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden" style={{ boxShadow: '0 0 30px ' + left.accent + '55' }}>
              <BrandImg src={left.roundLogo ? left.roundLogo : left.logo} alt={left.name} fallback={left.name} color={left.accent} fit={left.roundLogo ? 'cover' : 'contain'} className={left.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-2'} />
            </div>
            <span className="hidden md:inline text-xs tracking-[0.35em] uppercase text-cream/60">{left.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs tracking-[0.35em] uppercase text-cream/60">{right.name}</span>
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden" style={{ boxShadow: '0 0 30px ' + right.accent + '55' }}>
              <BrandImg src={right.roundLogo ? right.roundLogo : right.logo} alt={right.name} fallback={right.name} color={right.accent} fit={right.roundLogo ? 'cover' : 'contain'} className={right.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-2'} />
            </div>
          </div>
        </motion.div>

        {/* Заголовок сцены */}
        <motion.div style={{ y: headY, opacity: headOp }} className="absolute top-[14%] left-0 right-0 text-center px-6 z-10">
          <p className="text-amber text-[10px] md:text-xs tracking-[0.45em] uppercase mb-4 font-medium">Ресторан</p>
          <h3 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-cream mb-6">{r.name}</h3>
          <div className="w-14 h-0.5 mx-auto mb-6" style={{ background: r.accent }} />
          <p className="text-cream/60 text-sm md:text-base font-light max-w-xl mx-auto mb-8">
            {r.tagline}. {r.cuisine}.
          </p>
          <a href={'#' + r.path} className="btn-outline">Перейти в ресторан</a>
        </motion.div>

        {/* Планета-гигант снизу */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-52%] w-[92vmin] h-[92vmin]">
          <motion.div
            style={{ scale: dive, boxShadow: '0 0 120px 20px ' + r.accent + '44' }}
            className="w-full h-full rounded-full overflow-hidden"
          >
            <BrandImg
              src={r.roundLogo ? r.roundLogo : r.logo}
              alt={r.name}
              fallback={r.name}
              color={r.accent}
              fit={r.roundLogo ? 'cover' : 'contain'}
              className={r.roundLogo ? 'w-full h-full scale-[1.12]' : 'w-full h-full p-16'}
            />
            <div className="absolute inset-0 rounded-full sphere-shade pointer-events-none" />
          </motion.div>
        </div>

        {/* Поверхность планеты при нырке */}
        <motion.div style={{ opacity: surfOp }} className="absolute inset-0 z-20 pointer-events-none">
          {r.pattern ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(' + r.pattern + ')' }} />
          ) : (
            <div className="absolute inset-0" style={{ background: r.accent }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/40" />
        </motion.div>

        {/* Текст на поверхности */}
        <motion.div style={{ opacity: textOp, y: textY }} className="absolute bottom-[10%] right-[5%] left-[5%] md:left-auto md:max-w-md md:text-right z-30">
          <div className="w-14 h-0.5 mb-6 md:ml-auto" style={{ background: r.accent }} />
          <p className="text-cream/85 font-light leading-relaxed mb-8">
            {r.tagline}. Кухня: {r.cuisine}.
          </p>
          <a href={'#' + r.path} className="btn-outline">Перейти в ресторан</a>
        </motion.div>

      </div>
    </div>
  );
}

export default function CinematicRestaurants() {
  return (
    <section id="restaurants" className="relative bg-night">
      {restaurants.map((r, i) => (
        <Scene
          key={r.id}
          r={r}
          left={restaurants[(i + 3) % restaurants.length]}
          right={restaurants[(i + 1) % restaurants.length]}
        />
      ))}
    </section>
  );
}
