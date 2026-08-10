import { motion } from 'framer-motion';

interface Props { onBook: () => void; }

export default function Hero({ onBook }: Props) {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1537047902294-62a40c20a6b4?w=1920&q=85')",
          filter: 'brightness(0.55) saturate(1.1)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      <div className="relative h-full flex flex-col justify-center px-6 lg:px-12 max-w-[1600px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}>
          <p className="text-cream/80 text-xs lg:text-sm tracking-[0.35em] uppercase mb-6 font-light">
            Геленджик · Берег Чёрного моря
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[11rem] xl:text-[13rem] font-medium text-cream leading-[0.9] mb-4">
            КИН<span className="text-terra">Z</span>A
          </h1>
          <p className="font-serif text-cream/90 text-xl sm:text-2xl lg:text-3xl italic max-w-2xl leading-relaxed">
            Грузинская кухня. Вид на бухту.<br />Место, куда возвращаются.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
          className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button onClick={onBook} className="btn-terra">Забронировать стол</button>
          <a href="#menu" className="btn-outline">Посмотреть меню</a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-6 lg:left-12 flex flex-col items-center gap-3">
          <div className="text-cream/60 text-[10px] tracking-[0.3em] uppercase font-light">scroll</div>
          <div className="w-px h-16 bg-cream/40 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}