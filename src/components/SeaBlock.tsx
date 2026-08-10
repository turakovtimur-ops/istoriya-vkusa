import { motion } from 'framer-motion';

export default function SeaBlock() {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&q=85')",
          filter: 'brightness(0.7) saturate(1.2)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
      <div className="relative h-full flex items-center justify-center px-6 lg:px-12 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut' }}>
          <p className="text-cream/80 text-xs tracking-[0.4em] uppercase mb-8 font-light">Ужин с видом на море</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-9xl text-cream font-medium leading-[0.95] mb-10">
            Здесь можно<br /><em>прийти не только<br />за ужином.</em>
          </h2>
          <p className="text-cream/90 text-lg lg:text-xl max-w-xl mx-auto font-light leading-relaxed">
            Можно прийти за вечером.<br />За тишиной моря и шумом волн.<br />За ужином, который запомнится.
          </p>
        </motion.div>
      </div>
    </section>
  );
}