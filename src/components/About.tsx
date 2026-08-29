const facts = [
  { title: 'Вид на море', desc: 'Панорама Геленджикской бухты' },
  { title: 'Современный интерьер', desc: '120 мест, авторский дизайн' },
  { title: 'Кухня', desc: 'Грузинская, кавказская, авторская' },
  { title: 'Шеф-повар', desc: 'Профессиональная команда' },
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-40 bg-cream">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="reveal text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">О ресторане</p>
            <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.95] mb-10 text-graphite">
              Место<br /><em className="text-forest">на каждый день.</em>
            </h2>
            <div className="reveal reveal-delay-2 space-y-6 text-graphite/80 text-lg leading-relaxed font-light max-w-xl">
              <p>Кинза — современный ресторан грузинской и кавказской кухни на берегу Чёрного моря. Здесь встречаются старинные рецепты и авторская подача, классика застолья и смелые идеи.</p>
              <p>Приходите завтракать под утреннее солнце, обедать, наблюдая за волнами, или провести вечер, который запомнится надолго.</p>
            </div>
            <div className="reveal reveal-delay-3 grid grid-cols-2 gap-8 mt-14 pt-14 border-t border-graphite/10">
              {facts.map((fact, i) => (
                <div key={i} className={i >= 2 ? 'reveal reveal-delay-4' : 'reveal'}>
                  <h3 className="font-serif text-xl font-medium text-graphite mb-1">{fact.title}</h3>
                  <p className="text-sm text-muted font-light">{fact.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 reveal reveal-delay-2">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544124232-4c9e0db0a0b3?w=1200&q=85"
                alt="Интерьер ресторана Кинза"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]" loading="lazy" />
              <div className="absolute bottom-6 left-6 bg-cream/90 backdrop-blur-sm px-6 py-4">
                <p className="font-serif text-sm italic text-graphite">«Приходите не просто поужинать —<br />приходите за вечером»</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}