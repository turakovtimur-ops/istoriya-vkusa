const fs = require('fs');
const path = require('path');

// ========== 1. Создаём RestaurantPage.tsx ==========
const restaurantPage = `import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { useModal } from '../hooks/useModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { HoldingRestaurant } from '../data/holding';

interface Props {
  restaurant: HoldingRestaurant;
}

export default function RestaurantPage({ restaurant }: Props) {
  const modal = useModal();
  useScrollAnimation();
  useDocumentMeta(restaurant.name, restaurant.description);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const accent = restaurant.accent;
  const accentLight = accent + '1a';
  const accentBorder = accent + '40';

  return (
    <div className="min-h-screen bg-cream">
      <Header onBook={modal.open} />
      
      <main className="pt-20 lg:pt-24">
        {/* ===== HERO ===== */}
        <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 lg:pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              {restaurant.roundLogo && (
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 shadow-lg" style={{ borderColor: accent }}>
                  <img src={restaurant.roundLogo} alt={restaurant.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-cream/60 text-xs lg:text-sm uppercase tracking-[0.3em] mb-2">{restaurant.cuisine}</p>
                <h1 className="text-4xl lg:text-6xl font-serif font-semibold tracking-tight text-cream">{restaurant.name}</h1>
              </div>
            </div>
            <p className="text-cream/80 text-lg lg:text-xl font-light max-w-2xl leading-relaxed">{restaurant.tagline}</p>
            <button onClick={modal.open} className="mt-8 px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
              Забронировать стол
            </button>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="reveal">
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>О ресторане</p>
              <h2 className="text-3xl lg:text-5xl font-serif font-semibold tracking-tighter mb-8 text-graphite">{restaurant.name}</h2>
              <p className="text-graphite/80 font-light text-lg leading-relaxed mb-6">{restaurant.description}</p>
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-1">Адрес</p>
                  <p className="text-graphite font-medium">{restaurant.address}</p>
                  <p className="text-sm text-graphite/60 mt-1">{restaurant.beach}</p>
                </div>
                <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-1">Телефон</p>
                  <a href={'tel:' + restaurant.phone.replace(/\\D/g, '')} className="text-graphite font-medium hover:underline">{restaurant.phone}</a>
                  <p className="text-sm text-graphite/60 mt-1">{restaurant.phoneFree}</p>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== MENU ===== */}
        <section className="py-16 lg:py-24 px-6 lg:px-12 border-y border-graphite/10" style={{ background: accentLight }}>
          <div className="max-w-[1400px] mx-auto text-center reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Меню</p>
            <h2 className="text-3xl lg:text-5xl font-serif font-semibold tracking-tighter mb-6 text-graphite">Наше меню</h2>
            <p className="text-graphite/70 font-light text-lg max-w-2xl mx-auto mb-10">
              Авторские блюда от шеф-повара. Свежие продукты, сезонные ингредиенты, черноморская кухня.
            </p>
            <a
              href="https://disk.yandex.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform"
              style={{ background: accent }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Скачать меню (PDF)
            </a>
          </div>
        </section>

        {/* ===== GALLERY ===== */}
        <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Галерея</p>
            <h2 className="text-3xl lg:text-5xl font-serif font-semibold tracking-tighter text-graphite">Атмосфера</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 reveal reveal-delay-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg group cursor-pointer">
                <img
                  src={'https://images.unsplash.com/photo-' + (153704790229462 + i * 1000) + '?w=800&q=80'}
                  alt={'Фото ' + i}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ===== BANQUETS ===== */}
        <section className="py-16 lg:py-24 px-6 lg:px-12 border-y border-graphite/10" style={{ background: accentLight }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Банкеты</p>
                <h2 className="text-3xl lg:text-5xl font-serif font-semibold tracking-tighter mb-8 text-graphite">Мероприятия и банкеты</h2>
                <p className="text-graphite/80 font-light text-lg leading-relaxed mb-8">
                  Проведите незабываемый праздник в атмосфере {restaurant.name}. Свадьбы, юбилеи, корпоративы — мы создадим идеальные условия для вашего торжества.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-graphite mb-1">Вместимость</p>
                      <p className="text-graphite/70 text-sm">До 80 гостей</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-graphite mb-1">Минимальный чек</p>
                      <p className="text-graphite/70 text-sm">от 3 500 ₽ на персону</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M9 11H1l8-8 8 8h-8z" />
                        <path d="M9 13v8" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-graphite mb-1">Что включено</p>
                      <p className="text-graphite/70 text-sm">Оформление, торт, DJ, обслуживание</p>
                    </div>
                  </div>
                </div>
                <a href={'tel:' + restaurant.phone.replace(/\\D/g, '')} className="inline-flex items-center gap-2 px-8 py-3 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
                  Связаться с менеджером
                </a>
              </div>
              <div className="reveal reveal-delay-1">
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80" alt="Банкетный зал" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== REVIEWS ===== */}
        <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Отзывы</p>
            <h2 className="text-3xl lg:text-5xl font-serif font-semibold tracking-tighter text-graphite">Гости о нас</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal reveal-delay-1">
            {[
              { name: 'Анна М.', text: 'Прекрасная атмосфера, вкусная еда и отличный сервис. Обязательно вернёмся!', rating: 5 },
              { name: 'Дмитрий К.', text: 'Лучший ресторан на побережье. Шеф-повар — мастер своего дела.', rating: 5 },
              { name: 'Елена С.', text: 'Отмечали юбилей — всё было идеально. Спасибо команде!', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-lg border border-graphite/5">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <svg key={j} width="20" height="20" viewBox="0 0 24 24" fill={accent} stroke={accent} strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-graphite/80 font-light leading-relaxed mb-6">"{review.text}"</p>
                <p className="text-sm font-medium text-graphite">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section className="py-16 lg:py-24 px-6 lg:px-12 border-t border-graphite/10">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Контакты</p>
              <h2 className="text-3xl lg:text-5xl font-serif font-semibold tracking-tighter text-graphite">Как нас найти</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 reveal reveal-delay-1">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-2">Адрес</p>
                  <p className="text-xl font-medium text-graphite">{restaurant.address}</p>
                  <p className="text-graphite/70 mt-1">{restaurant.beach}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-2">Телефон</p>
                  <a href={'tel:' + restaurant.phone.replace(/\\D/g, '')} className="text-xl font-medium text-graphite hover:underline block">{restaurant.phone}</a>
                  <p className="text-graphite/70 mt-1">{restaurant.phoneFree}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-2">Часы работы</p>
                  <p className="text-xl font-medium text-graphite">Ежедневно 12:00 — 00:00</p>
                </div>
                <button onClick={modal.open} className="mt-6 px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
                  Забронировать стол
                </button>
              </div>
              <div className="aspect-[4/3] lg:aspect-auto rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={'https://yandex.ru/map-widget/v1/?ll=38.085500%2C44.561800&z=15&text=' + encodeURIComponent(restaurant.address + ', Геленджик')}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ minHeight: 400 }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BookingModal isOpen={modal.isOpen} onClose={modal.close} />
      <button
        onClick={modal.open}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-2xl shadow-black/30 px-8 py-4"
        style={{ background: accent }}
      >
        Забронировать стол
      </button>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'RestaurantPage.tsx'), restaurantPage, 'utf-8');
console.log('✓ создан RestaurantPage.tsx');

// ========== 2. Обновляем Holding.tsx ==========
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// Добавляем импорт RestaurantPage
if (!h.includes("import RestaurantPage from '../sites/RestaurantPage'")) {
  const importIdx = h.lastIndexOf('import ');
  const importEnd = h.indexOf(';', importIdx);
  h = h.slice(0, importEnd + 1) + "\nimport RestaurantPage from '../sites/RestaurantPage';" + h.slice(importEnd + 1);
  console.log('✓ добавлен импорт RestaurantPage');
}

// Находим функцию рендеринга ресторанов и заменяем на RestaurantPage
const renderStart = h.indexOf('function renderRestaurant');
const renderEnd = h.indexOf('export default function Holding');
if (renderStart !== -1 && renderEnd !== -1) {
  const newRender = `function renderRestaurant(rest: HoldingRestaurant) {
  return <RestaurantPage restaurant={rest} />;
}

`;
  h = h.slice(0, renderStart) + newRender + h.slice(renderEnd);
  console.log('✓ функция renderRestaurant обновлена');
}

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');

// ========== 3. Архивируем старые файлы ==========
const oldFiles = [
  'src/sites/KinzaSite.tsx',
  'src/sites/UniversalRestaurantSite.tsx',
];
for (const f of oldFiles) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    const backup = p.replace('.tsx', '_old.tsx');
    fs.renameSync(p, backup);
    console.log('✓ архивирован:', f, '→', path.basename(backup));
  }
}

console.log('\\n✅ Готово! Все 4 ресторана используют единый шаблон.');
console.log('\\nДальше: npm run dev → открой любой ресторан (#/kinza, #/nino, #/astoria, #/la-costa)');
console.log('Если всё ок: npm run build → git add . && git commit -m "Единый шаблон ресторанов" && git push');