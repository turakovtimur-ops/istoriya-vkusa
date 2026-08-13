const fs = require('fs');
const path = require('path');

// ================= УНИВЕРСАЛЬНЫЙ КОМПОНЕНТ =================
const universal = `import { useState, useEffect } from 'react';
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
    primary: string;    // основной фон (cream, ivory, white)
    accent: string;     // акцентный (terra, crimson, champagne, turquoise)
    text: string;       // основной текст (graphite, charcoal, slate)
    muted: string;      // второстепенный текст
    forest?: string;    // дополнительный (для Кинзы)
  };
}

interface Props { data: RestaurantData; }

export default function UniversalRestaurantSite({ data }: Props) {
  const modal = useModal();
  useScrollAnimation();

  const { colors } = data;
  const cssVars = {
    '--r-primary': colors.primary,
    '--r-accent': colors.accent,
    '--r-text': colors.text,
    '--r-muted': colors.muted,
    '--r-forest': colors.forest || colors.accent,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.primary, ...cssVars }}>
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
          <img src={data.logo} alt={data.name} className="w-10 h-10 object-contain" style={{ filter: scrolled ? 'none' : 'brightness(2)' }} />
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
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[11rem] xl:text-[13rem] font-medium text-[#F5F2EA] leading-[0.9] mb-4">
            {data.name.split(' ')[0]}
          </h1>
          <p className="font-serif text-[#F5F2EA]/90 text-xl sm:text-2xl lg:text-3xl italic max-w-2xl leading-relaxed">{data.heroSubtitle}</p>
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
            <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.95] mb-10" style={{ color: data.colors.text }}>
              {data.aboutTitle}
            </h2>
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
                <p className="font-serif text-sm italic" style={{ color: data.colors.text }}>{data.aboutQuote}</p>
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
            <div key={i} className="reveal group" style={{ animationDelay: (i * 0.1) + 's' }}>
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
            <div key={i} className="reveal aspect-square overflow-hidden" style={{ animationDelay: (i * 0.08) + 's' }}>
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
            <div key={i} className="reveal p-8" style={{ backgroundColor: data.colors.text + '08', animationDelay: (i * 0.1) + 's' }}>
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
        <div className="flex items-center gap-3">
          <img src={data.logo} alt={data.name} className="w-8 h-8 object-contain" style={{ filter: 'brightness(2)' }} />
          <span className="font-serif text-xl font-medium">{data.name}</span>
        </div>
        <a href="#/" className="text-sm font-light opacity-80 hover:opacity-100 transition-opacity">← В холдинг «История Вкуса»</a>
        <p className="text-xs font-light opacity-60">© 2026 Ресторанный холдинг</p>
      </div>
    </footer>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'UniversalRestaurantSite.tsx'), universal, 'utf-8');
console.log('✓ UniversalRestaurantSite создан');

// ================= 3 ОБЁРТКИ =================
const make = (id, data) => {
  const content = \`import UniversalRestaurantSite, { RestaurantData } from '../components/UniversalRestaurantSite';

const data: RestaurantData = ${JSON.stringify(data, null, 2)};

export default function ${id}() {
  return <UniversalRestaurantSite data={data} />;
}
\`;
  return content;
};

const nino = make('NinoSite', {
  id: 'nino', name: 'НИНО', logo: '/images/nino-logo.png', cuisine: 'Грузинская современная',
  slogan: 'Вкусно! Сочно! По-грузински!',
  heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=85',
  heroSubtitle: 'Современная Грузия у яхт-клуба.\\nМесто приватности и вкуса.',
  aboutTitle: 'Вкус как в Грузии.',
  aboutText: [
    'НИНО — ресторан современной грузинской кухни у яхт-клуба. В меню собраны хиты Грузии: свежие продукты, тонкий баланс пряностей и настоящие грузинские специи.',
    'Эти шедевры готовят специально приглашённые из Грузии повара. Радушный приём, живая музыка и грузинский колорит сделают посещение незабываемым.',
  ],
  facts: [
    { title: 'У яхт-клуба', desc: 'Приватность и вид на море' },
    { title: 'Повара из Грузии', desc: 'Специально приглашённые' },
    { title: 'Живая музыка', desc: 'Колорит и атмосфера' },
    { title: 'Комплимент от шефа', desc: 'Каждому гостю' },
  ],
  aboutImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=85',
  aboutQuote: '«Время замедляет ход —\\nа ароматы свежей выпечки\\nнаполняют воздух»',
  dishes: [
    { name: 'Хинкали с ягнёнком', desc: 'Классика гор — сочные, ароматные, ручной лепки', image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=800&q=85' },
    { name: 'Аджарули', desc: 'Хачапури-лодочка с яйцом и сулугуни — как в Батуми', image: 'https://images.unsplash.com/photo-1565299543923-37dd1788f001?w=800&q=85' },
    { name: 'Ножка ягнёнка в винном соусе', desc: 'Томлёная, тающая во рту, с глубоким вкусом', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=85' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=85',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=85',
    'https://images.unsplash.com/photo-1592861956120-e524fc73612b?w=600&q=85',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=85',
    'https://images.unsplash.com/photo-1551218807-65265ec3d40b?w=600&q=85',
  ],
  reviews: [
    { name: 'Татьяна Шабаева', text: 'Тёплая и дружеская атмосфера, профессионализм. Яркий вид на море и оригинальный интерьер. Все блюда очень вкусны, были поражены комплиментом от шефа!' },
    { name: 'Дарья Рощупко', text: 'Помимо вкусной еды, вкусно было всё: супы, хычин, салат. Принесли комплимент от заведения — вкуснейшую настойку. Обслуживание просто великолепное!' },
  ],
  address: 'Революционная ул., 34, корп. 6', beach: 'Пляж «Сады Морей»',
  phone: '+7 (928) 410-03-42', phoneFree: '8 (800) 201-57-57, доб. 4',
  colors: { primary: '#F5F0E8', accent: '#B8272D', text: '#1A1A1A', muted: '#6B5D4F' },
});
fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'NinoSite.tsx'), nino, 'utf-8');
console.log('✓ NinoSite создан');

const astoria = make('AstoriaSite', {
  id: 'astoria', name: 'Астория', logo: '/images/astoria-logo.png', cuisine: 'Черноморская кухня',
  slogan: 'Три этажа комфортного отдыха',
  heroImage: 'https://images.unsplash.com/photo-1578474846511-04ba559df046?w=1920&q=85',
  heroSubtitle: 'Высокая черноморская кухня.\\nАквариум с живыми устрицами.',
  aboutTitle: 'Три этажа\\nвида и вкуса.',
  aboutText: [
    'Астория — ресторан высокой черноморской кухни на первой береговой линии «Садов Морей». Из панорамных окон в любое время года видно Чёрное море и горы.',
    'Астория гордится большим аквариумом с живыми устрицами и другими представителями морской фауны. В тёплое время работает открытая терраса на всех этажах.',
  ],
  facts: [
    { title: 'Три этажа', desc: 'Терраса на каждом' },
    { title: 'Живые устрицы', desc: 'Прямо из аквариума' },
    { title: 'Панорама 270°', desc: 'Бухта, город, закаты' },
    { title: 'Высокая кухня', desc: 'Авторские блюда' },
  ],
  aboutImage: 'https://images.unsplash.com/photo-1590846406792-003e62a4d3d0?w=1200&q=85',
  aboutQuote: '«Просторы моря\\nстали частью ресторана —\\nи меню тоже»',
  dishes: [
    { name: 'Фирменные сковородки', desc: 'Мидии и рапаны в авторских соусах — восторг гостей', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=85' },
    { name: 'Живые устрицы', desc: 'Ромаринка, Маака, Джоли — прямо из аквариума ресторана', image: 'https://images.unsplash.com/photo-1606685511187-c7f0e7e89f0c?w=800&q=85' },
    { name: 'Таёжная утка', desc: 'С брусничным соусом — фирменное горячее от бренд-шефа', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=85' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=85',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=85',
    'https://images.unsplash.com/photo-1592861956120-e524fc73612b?w=600&q=85',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=85',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=85',
  ],
  reviews: [
    { name: 'Марина', text: 'Третий год подряд, когда приезжаем в Геленджик, приходим сюда насладиться вкусными блюдами и прекрасным видом на город и море.' },
    { name: 'Ольга', text: 'Были у вас 2 раза в июне. Фирменные сковородки с морепродуктами — просто восторг!' },
    { name: 'Александр', text: 'Отмечали юбилей папы 70 лет. Очень уютный красивый ресторан с видом на Геленджикскую бухту. Приветливый персонал!' },
  ],
  address: 'Революционная ул., 34', beach: 'Пляж «Сады Морей»',
  phone: '+7 (928) 882-00-40', phoneFree: '8 (800) 201-57-57, доб. 3',
  colors: { primary: '#F8F5F0', accent: '#C9A961', text: '#1F2429', muted: '#6B6359' },
});
fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'AstoriaSite.tsx'), astoria, 'utf-8');
console.log('✓ AstoriaSite создан');

const lacosta = make('LaCostaSite', {
  id: 'la-costa', name: 'Ла Коста Берег', logo: '/images/lacosta-logo.png', cuisine: 'Европейская · Черноморская',
  slogan: 'Восхитительные коктейли и прекрасный вид',
  heroImage: 'https://images.unsplash.com/photo-1540914123045-651cb8244620?w=1920&q=85',
  heroSubtitle: 'Набережная, закаты, живая музыка.\\nМесто с многолетней историей.',
  aboutTitle: 'Закаты над бухтой\\nпрямо из-за стола.',
  aboutText: [
    'Ла Коста Берег — ресторан с многолетней историей на центральной набережной. Свежий ветерок, лучи солнца на морской глади и дразнящий аромат шашлыка.',
    'Богатое мясное меню, коктейль-бар, живая музыка и танцпол. Любоваться волнами Чёрного моря можно с летней веранды или сидя у окна.',
  ],
  facts: [
    { title: 'Центральная набережная', desc: 'Первая линия' },
    { title: 'Живая музыка', desc: 'DJ и танцпол' },
    { title: 'Закаты', desc: 'Прямо из-за стола' },
    { title: 'Мясное меню', desc: 'Стейки, шашлык, мангал' },
  ],
  aboutImage: 'https://images.unsplash.com/photo-1574971046566-1d21f5d5d7a7?w=1200&q=85',
  aboutQuote: '«Свежий ветер,\\nзакаты над бухтой\\nи живая музыка\\nу самого моря»',
  dishes: [
    { name: 'Брускетты', desc: 'Отдельный вид кулинарного искусства — лёгкие и свежие', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2cc68?w=800&q=85' },
    { name: 'Стейки на мангале', desc: 'Чистая радость для любителей мяса по демократичному ценнику', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=85' },
    { name: 'Авторские коктейли', desc: 'Восхитительная коктейльная карта у самого моря', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=85' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1574971046566-1d21f5d5d7a7?w=600&q=85',
    'https://images.unsplash.com/photo-1540914123045-651cb8244620?w=600&q=85',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=85',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=85',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=85',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85',
  ],
  reviews: [
    { name: 'Ольга Пленкина', text: 'Любим вечерние танцы и дневной кофе. Живая музыка душевная и хорошее обслуживание. Закаты из кафе чудесны и изобильны.' },
    { name: 'Инна Дубовицкая', text: 'Уютно, вкусно, приятная атмосфера, живая музыка. Одно из немногих оживлённых мест Геленджика.' },
    { name: 'Татьяна Терзян', text: 'Прекрасный персонал, учли все пожелания, разместили на террасе, несмотря на дождь, по нашей просьбе!' },
  ],
  address: 'Революционная ул., 11', beach: 'Пляж «Дельфин»',
  phone: '+7 (938) 433-95-55', phoneFree: '8 (800) 201-57-57, доб. 2',
  colors: { primary: '#FFFFFF', accent: '#0891B2', text: '#1E3A4C', muted: '#64748B' },
});
fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'LaCostaSite.tsx'), lacosta, 'utf-8');
console.log('✓ LaCostaSite создан');

// ================= ОБНОВЛЕНИЕ РОУТЕРА =================
let app = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf-8');
if (app.includes('NinoSite')) {
  console.log('✓ App.tsx уже обновлён');
} else {
  app = app.replace(
    "import KinzaSite from './sites/KinzaSite';",
    "import KinzaSite from './sites/KinzaSite';\nimport NinoSite from './sites/NinoSite';\nimport AstoriaSite from './sites/AstoriaSite';\nimport LaCostaSite from './sites/LaCostaSite';"
  );
  app = app.replace(
    "if (route.startsWith('/nino')) return <RestaurantStub path=\"/nino\" />;",
    "if (route.startsWith('/nino')) return <NinoSite />;"
  );
  app = app.replace(
    "if (route.startsWith('/astoria')) return <RestaurantStub path=\"/astoria\" />;",
    "if (route.startsWith('/astoria')) return <AstoriaSite />;"
  );
  app = app.replace(
    "if (route.startsWith('/la-costa')) return <RestaurantStub path=\"/la-costa\" />;",
    "if (route.startsWith('/la-costa')) return <LaCostaSite />;"
  );
  fs.writeFileSync(path.join(__dirname, 'src', 'App.tsx'), app, 'utf-8');
  console.log('✓ App.tsx обновлён: роутинг на новые сайты');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "3 новых сайта ресторанов" && git push');