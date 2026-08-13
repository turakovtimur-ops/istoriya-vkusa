const fs = require('fs');
const path = require('path');

const code = `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal';
import { useModal } from '../hooks/useModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export interface RestaurantData {
  id: string;
  name: string;
  logo: string;
  cuisine: string;
  slogan: string;
  heroImage: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string[];
  facts: { title: string; desc: string }[];
  aboutImage: string;
  aboutQuote: string;
  dishes: { name: string; desc: string; image: string }[];
  gallery: string[];
  reviews: { name: string; text: string }[];
  address: string;
  beach: string;
  phone: string;
  phoneFree: string;
  colors: {
    primary: string;
    accent: string;
    text: string;
    muted: string;
    forest?: string;
  };
}

interface Props { data: RestaurantData; }

export default function UniversalRestaurantSite({ data }: Props) {
  const modal = useModal();
  useScrollAnimation();
  const { colors } = data;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.primary }}>
      <Header data={data} onBook={modal.open} />
      <main>
        <Hero data={data} onBook={modal.open} />
        <About data={data} />
        <Dishes data={data} />
        <Gallery data={data} />
        <Reviews data={data} />
        <Contact data={data} onBook={modal.open} />
      </main>
      <Footer data={data} />
      <BookingModal isOpen={modal.isOpen} onClose={modal.close} />
      <button
        onClick={modal.open}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-2xl shadow-black/30 px-8 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-all hover:scale-105"
        style={{ backgroundColor: colors.accent, color: colors.primary }}
      >
        Забронировать стол
      </button>
    </div>
  );
}

function Header({ data, onBook }: { data: RestaurantData; onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  const textColor = scrolled ? data.colors.text : '#F5F2EA';
  return (
    <header className={'fixed top-0 left-0 right-0 z-50 transition-all duration-700 py-4 lg:py-6 ' + (scrolled ? 'backdrop-blur-md border-b' : '')}
      style={{ backgroundColor: scrolled ? data.colors.primary + 'f2' : 'transparent', borderColor: scrolled ? data.colors.text + '15' : 'transparent' }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <a href="#/" className="relative z-10 flex items-center gap-3">
          <span className="font-serif text-2xl lg:text-3xl font-medium tracking-tight transition-colors duration-700" style={{ color: textColor }}>
            {data.name}
          </span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          <a href={'tel:' + data.phone.replace(/[^+\\d]/g, '')} className="text-sm font-light tracking-wide transition-colors" style={{ color: textColor }}>{data.phone}</a>
          <button onClick={onBook} className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all hover:scale-105" style={{ backgroundColor: data.colors.accent, color: data.colors.primary }}>
            Забронировать
          </button>
        </div>
        <a href="#/" className="lg:hidden relative z-10 text-sm transition-colors" style={{ color: textColor }}>← Холдинг</a>
      </div>
    </header>
  );
}

function Hero({ data, onBook }: { data: RestaurantData; onBook: () => void }) {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: 'url(' + data.heroImage + ')', filter: 'brightness(0.5) saturate(1.1)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      <div className="relative h-full flex flex-col justify-center px-6 lg:px-12 max-w-[1600px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.3 }}>
          <p className="text-[#F5F2EA]/80 text-xs lg:text-sm tracking-[0.35em] uppercase mb-6 font-light">Геленджик · {data.beach}</p>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-medium text-[#F5F2EA] leading-[0.9] mb-4">{data.name}</h1>
          <p className="font-serif text-[#F5F2EA]/90 text-xl sm:text-2xl lg:text-3xl italic max-w-2xl leading-relaxed whitespace-pre-line">{data.heroSubtitle}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1 }} className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button onClick={onBook} className="px-8 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-all hover:scale-105" style={{ backgroundColor: data.colors.accent, color: data.colors.primary }}>
            Забронировать стол
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-10 left-6 lg:left-12 flex flex-col items-center gap-3">
          <div className="text-[#F5F2EA]/60 text-[10px] tracking-[0.3em] uppercase font-light">scroll</div>
          <div className="w-px h-16 bg-[#F5F2EA]/40 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}

function About({ data }: { data: RestaurantData }) {
  return (
    <section className="py-24 lg:py-40" style={{ backgroundColor: data.colors.primary }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="reveal text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: data.colors.accent }}>О ресторане</p>
            <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.95] mb-10 whitespace-pre-line" style={{ color: data.colors.text }}>{data.aboutTitle}</h2>
            <div className="reveal reveal-delay-2 space-y-6 text-lg leading-relaxed font-light max-w-xl" style={{ color: data.colors.text + 'cc' }}>
              {data.aboutText.map((t, i) => <p key={i}>{t}</p>)}
            </div>
            <div className="reveal reveal-delay-3 grid grid-cols-2 gap-8 mt-14 pt-14" style={{ borderTop: '1px solid ' + data.colors.text + '15' }}>
              {data.facts.map((fact, i) => (
                <div key={i}>
                  <h3 className="font-serif text-xl font-medium mb-1" style={{ color: data.colors.text }}>{fact.title}</h3>
                  <p className="text-sm font-light" style={{ color: data.colors.muted }}>{fact.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 reveal reveal-delay-2">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
              <img src={data.aboutImage} alt={data.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]" loading="lazy" />
              <div className="absolute bottom-6 left-6 backdrop-blur-sm px-6 py-4" style={{ backgroundColor: data.colors.primary + 'e6' }}>
                <p className="font-serif text-sm italic whitespace-pre-line" style={{ color: data.colors.text }}>{data.aboutQuote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dishes({ data }: { data: RestaurantData }) {
  return (
    <section className="py-24 lg:py-40" style={{ backgroundColor: data.colors.primary }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <p className="reveal text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: data.colors.accent }}>Фирменное меню</p>
        <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl font-medium leading-[0.95] mb-14" style={{ color: data.colors.text }}>Блюда, ради которых возвращаются</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.dishes.map((d, i) => (
            <div key={i} className="reveal group">
              <div className="aspect-[4/5] overflow-hidden mb-5">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]" loading="lazy" />
              </div>
              <h3 className="font-serif text-2xl font-medium mb-2" style={{ color: data.colors.text }}>{d.name}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: data.colors.muted }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ data }: { data: RestaurantData }) {
  return (
    <section className="py-24 lg:py-40" style={{ backgroundColor: data.colors.primary }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <p className="reveal text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: data.colors.accent }}>Галерея</p>
        <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl font-medium leading-[0.95] mb-14" style={{ color: data.colors.text }}>Атмосфера</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5">
          {data.gallery.map((src, i) => (
            <div key={i} className="reveal aspect-square overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1500ms]" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ data }: { data: RestaurantData }) {
  return (
    <section className="py-24 lg:py-40" style={{ backgroundColor: data.colors.primary }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <p className="reveal text-xs tracking-[0.3em] uppercase mb-6 font-medium text-center" style={{ color: data.colors.accent }}>Гости говорят</p>
        <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl font-medium leading-[0.95] mb-14 text-center" style={{ color: data.colors.text }}>Отзывы</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.reviews.map((r, i) => (
            <div key={i} className="reveal p-8" style={{ backgroundColor: data.colors.text + '08' }}>
              <p className="font-serif italic leading-relaxed mb-6" style={{ color: data.colors.text + 'cc' }}>«{r.text}»</p>
              <p className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: data.colors.accent }}>— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, onBook }: { data: RestaurantData; onBook: () => void }) {
  return (
    <section className="py-24 lg:py-40" style={{ backgroundColor: data.colors.primary }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <p className="reveal text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: data.colors.accent }}>Контакты</p>
        <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl font-medium leading-[0.95] mb-14" style={{ color: data.colors.text }}>Ждём вас</h2>
        <div className="reveal reveal-delay-2 space-y-3 mb-10" style={{ color: data.colors.text + 'cc' }}>
          <p className="text-lg font-light">{data.address} · {data.beach}</p>
          <a href={'tel:' + data.phone.replace(/[^+\\d]/g, '')} className="text-lg hover:underline transition-colors">{data.phone}</a>
          <p className="text-sm" style={{ color: data.colors.muted }}>{data.phoneFree}</p>
        </div>
        <button onClick={onBook} className="reveal reveal-delay-3 px-10 py-5 text-sm uppercase tracking-[0.2em] font-medium transition-all hover:scale-105" style={{ backgroundColor: data.colors.accent, color: data.colors.primary }}>
          Забронировать стол
        </button>
      </div>
    </section>
  );
}

function Footer({ data }: { data: RestaurantData }) {
  return (
    <footer className="py-12" style={{ backgroundColor: data.colors.text, color: data.colors.primary }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-serif text-xl font-medium">{data.name}</span>
        <a href="#/" className="text-sm font-light opacity-80 hover:opacity-100 transition-opacity">← В холдинг «История Вкуса»</a>
        <p className="text-xs font-light opacity-60">© 2026 Ресторанный холдинг</p>
      </div>
    </footer>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'UniversalRestaurantSite.tsx'), code, 'utf-8');
console.log('✓ UniversalRestaurantSite.tsx создан');
console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Универсальный компонент ресторанов" && git push');