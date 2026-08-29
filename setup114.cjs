const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ---------- 0) предупреждение по весу PDF ----------
const mdir = P('public/menus');
if (fs.existsSync(mdir)) {
  let heavy = 0;
  for (const f of fs.readdirSync(mdir)) {
    const mb = fs.statSync(path.join(mdir, f)).size / 1024 / 1024;
    console.log('  PDF: ' + f + ' — ' + mb.toFixed(1) + ' МБ');
    if (mb > 15) heavy++;
  }
  if (heavy) console.log('⚠ ВНИМАНИЕ: ' + heavy + ' файлов тяжелее 15 МБ! Сожми на ilovepdf.com/compress_pdf ПЕРЕД пушем, иначе push будет ползти час');
  else console.log('✓ вес PDF в норме');
}

// ---------- 1) скан галерей ----------
const scanGal = (id) => {
  const dir = P('public/images/' + id + '/gallery');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => '/images/' + id + '/gallery/' + f);
};

const EXTRA = {
  kinza: {
    hours: '09:00–00:00',
    reviews: [
      { name: 'Светлана Гончарова', text: 'Великолепный панорамный вид на море! Грузинский ресторан с тихой ненавязчивой музыкой! Заказывали хинкали — мы в восторге: и начинка, и тесто — пальчики отъешь!' },
      { name: 'meindorff', text: 'Очень уютный ресторанчик прямо на набережной. Пробовали хинкали, суп харчо, грузинский салат и хачапури разных видов — всё очень вкусно.' },
      { name: 'Аня', text: 'Посещаю второй раз, и второй раз мой выбор падает на рыбку — очень вкусный стейк. Подача на высоте, живая музыка очень вписывается. Спасибо за прекрасный вечер!' },
      { name: 'Никита Чемоданов', text: 'Отличный ресторан. Очень вкусная еда, обстановка и персонал на высшем уровне. Хинкали превосходные. Отличный вид из зала на море.' },
    ],
  },
  nino: {
    hours: '08:00–00:00',
    reviews: [
      { name: 'Елена Гордеева', text: 'Третий год приезжаем в Геленджик и нашли для себя уютный ресторан на берегу моря. Цены демократичные, блюда выглядят эстетически и вкусные. Обязательно вернёмся!' },
      { name: 'Юлия Васильева', text: 'Шикарный ресторан! Всегда вкусно на 100%. Ходим уже постоянно, официанты доброжелательные и внимательные. Еда обалденная! Всем советуем!' },
      { name: 'Злата Котик', text: 'Были вечером после моря — всё очень вкусно! Цезарь с креветками, карбонара, барабулька — всё классно. Нас встретили вежливо и показали столик. Спасибо!' },
      { name: 'Марина Осипова', text: 'Уютное место на набережной с прекрасным видом. Заказывали десерты с чаем — минимально сладкие и вкусные, как и хотели. Спасибо за рекомендации.' },
    ],
  },
  astoria: {
    hours: '09:00–00:00',
    reviews: [
      { name: 'Алёна Ковалёва', text: 'Выбирала заведения по Яндекс Картам и осталась очень довольна. Кухня порадовала морскими блюдами, второй этаж — с хорошим видом на бухту. Обязательно посетите!' },
      { name: 'Давлетбий Негуч', text: 'Ресторан 1000/10. Просто без слов: от хостес до официанта — всё великолепно. Блюда подаются быстро и по вкусу просто сойти с ума. Лучшее место города!' },
      { name: 'Ксения М', text: 'Прекрасный персонал, прекрасная кухня. Устрицы и морепродукты — это шедевр, приезжаем не первый год. Отдельная благодарность Максиму за чуткое обслуживание!' },
      { name: 'Наталья', text: 'Огромная благодарность всему коллективу «Астории» за прекрасно проведённый вечер. Великолепная кухня, внимательный персонал и уютная обстановка. Всё было очень вкусно!' },
    ],
  },
  'la-costa': {
    hours: '08:00–02:00',
    reviews: [
      { name: 'Александр К.', text: 'Официанту Софии — респект и большое спасибо за профессиональное отношение и теплоту. Мы все 7 вечеров ходили только из-за неё. Всё меню вкусное, атмосфера на высшем уровне, всё в центре на пляже!' },
      { name: 'Светлана Чубчикова', text: 'Лучшее место Геленджика! За 10 дней отдыха ничего лучшего не нашли! Обслуживание на великолепном уровне, DJ и музыка — огонь, стейк был просто бомба! Спасибо за прекрасный вечер!' },
      { name: 'Дарья', text: 'Хорошее заведение, вкусная еда и приятная музыка. Хочу отметить обслуживание: доброжелательная девушка встретила с улыбкой и проводила к месту. А ещё еду можно забрать с собой — большой плюс!' },
      { name: 'Vladislav2801', text: 'Превосходное место. Большой ассортимент блюд, интересные разновидности привычных позиций. Официант София грамотно проконсультировала по меню — мы остались довольны. 5 звёзд.' },
    ],
  },
};

for (const id of Object.keys(EXTRA)) EXTRA[id].gallery = scanGal(id);

fs.writeFileSync(P('src/data/resto-extra.ts'),
  '// генерируется setup114.cjs — после добавления фото в gallery запусти setup заново\n' +
  'export interface RestoExtra { hours: string; reviews: { name: string; text: string }[]; gallery: string[] }\n' +
  'export const RESTO_EXTRA: Record<string, RestoExtra> = ' + JSON.stringify(EXTRA, null, 2) + ';\n', 'utf-8');
console.log('✓ resto-extra.ts: часы, отзывы, галереи (' +
  Object.keys(EXTRA).map((k) => k + ': ' + EXTRA[k].gallery.length + ' фото').join(', ') + ')');

// ---------- 2) новый RestaurantPage ----------
fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), `import { useEffect, useState } from 'react';
import BookingModal from '../components/BookingModal';
import { useModal } from '../hooks/useModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { HoldingRestaurant, holdingBrand } from '../data/holding';
import { RESTO_EXTRA } from '../data/resto-extra';

interface Props { restaurant: HoldingRestaurant; }

const NAV: [string, string][] = [
  ['about', 'Ресторан'],
  ['menu', 'Меню'],
  ['gallery', 'Галерея'],
  ['banquets', 'Банкеты'],
  ['reviews', 'Отзывы'],
  ['contacts', 'Контакты'],
];
const H2C = 'text-4xl md:text-6xl font-semibold tracking-tighter';
const FALLBACK_GALLERY = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
];

export default function RestaurantPage({ restaurant }: Props) {
  const modal = useModal();
  const [burger, setBurger] = useState(false);
  useScrollAnimation();
  useDocumentMeta(restaurant.name + ' — ' + restaurant.cuisine + ' | История Вкуса', restaurant.tagline);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const accent = restaurant.accent;
  const tel = 'tel:' + restaurant.phone.replace(/[^0-9+]/g, '');
  const extra = RESTO_EXTRA[restaurant.id] || { hours: '09:00–00:00', reviews: [], gallery: [] };
  const gallery = extra.gallery.length ? extra.gallery : FALLBACK_GALLERY;
  const menus = [
    { file: '/menus/' + restaurant.id + '-kuhnya.pdf', label: 'Кухня' },
    { file: '/menus/' + restaurant.id + '-bar.pdf', label: 'Бар' },
    { file: '/menus/' + restaurant.id + '-deserty.pdf', label: 'Десерты' },
  ];
  const yandexReviews = 'https://yandex.ru/maps/?text=' + encodeURIComponent(restaurant.name + ' Геленджик');
  const go = (id: string) => {
    setBurger(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };
  return (
    <div className="min-h-screen bg-cream">
      <div className="sticky top-0 z-50">
        <a href="#/" className="block bg-graphite text-cream/70 hover:text-cream transition-colors">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
            <span className="flex items-center gap-2">
              <img src={holdingBrand.roundLogo} alt="" className="w-5 h-5 rounded-full object-cover" />
              ← Вернуться в холдинг
            </span>
            <span className="hidden md:block">Геленджик · 8 800 201-57-57</span>
          </div>
        </a>
        <header className="bg-cream/95 backdrop-blur border-b border-graphite/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center" aria-label={restaurant.name}>
              <img src={restaurant.logo} alt={restaurant.name} className="h-10 lg:h-12 w-auto object-contain" />
            </button>
            <nav className="hidden lg:flex items-center gap-7">
              {NAV.map(([id, label]) => (
                <button key={id} onClick={() => go(id)} className="text-sm text-graphite/70 hover:text-graphite transition-colors tracking-wide">{label}</button>
              ))}
            </nav>
            <div className="hidden lg:flex items-center gap-5">
              <a href={tel} className="text-sm font-medium text-graphite hover:underline whitespace-nowrap">{restaurant.phone}</a>
              <button onClick={modal.open} className="px-6 py-3 text-xs uppercase tracking-widest font-medium text-cream hover:opacity-90 transition-opacity" style={{ background: accent }}>Забронировать</button>
            </div>
            <button className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5" aria-label="Меню" onClick={() => setBurger(true)}>
              <span className="block w-6 h-px bg-graphite" /><span className="block w-6 h-px bg-graphite" /><span className="block w-4 h-px bg-graphite" />
            </button>
          </div>
        </header>
      </div>
      {burger && (
        <div className="fixed inset-0 z-[70] bg-graphite/95 backdrop-blur-xl flex flex-col" onClick={() => setBurger(false)}>
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-cream/10" onClick={(e) => e.stopPropagation()}>
            <img src={restaurant.logo} alt={restaurant.name} className="h-9 w-auto object-contain brightness-0 invert" />
            <button aria-label="Закрыть" onClick={() => setBurger(false)} className="w-11 h-11 rounded-full border border-cream/20 flex items-center justify-center text-cream">✕</button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {NAV.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="py-3 text-left text-2xl font-bold tracking-tight text-cream/90 border-b border-cream/5">{label}</button>
            ))}
          </nav>
          <div className="px-8 pb-10 pt-4" onClick={(e) => e.stopPropagation()}>
            <a href={tel} className="inline-block text-sm tracking-[0.2em] uppercase text-amber border-b border-amber/40 pb-1 mb-4">{restaurant.phone}</a>
            <p className="text-cream/40 text-xs font-light">{restaurant.address} · {restaurant.beach}</p>
            <a href="#/" className="block mt-4 text-[10px] uppercase tracking-[0.3em] text-cream/50">← Вернуться в холдинг</a>
          </div>
        </div>
      )}
      <main>
        <section className="relative h-[55vh] lg:h-[70vh] overflow-hidden">
          <img src={restaurant.image} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="relative z-10 h-full flex flex-col justify-end pb-12 lg:pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto">
            <p className="text-cream/60 text-xs lg:text-sm uppercase tracking-[0.3em] mb-3">{restaurant.cuisine}</p>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter text-cream mb-4">{restaurant.name}</h1>
            <p className="text-cream/80 text-lg lg:text-xl font-light max-w-2xl leading-relaxed">{restaurant.tagline}</p>
            <button onClick={modal.open} className="mt-8 self-start px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>Забронировать стол</button>
          </div>
        </section>

        <section id="about" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="reveal">
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>О ресторане</p>
              <h2 className={H2C + ' mb-8 text-graphite'}>{restaurant.name}</h2>
              <p className="text-graphite/80 font-light text-lg leading-relaxed mb-10">{restaurant.description}</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-1">Адрес</p>
                  <p className="text-graphite font-medium">{restaurant.address}</p>
                  <p className="text-sm text-graphite/60 mt-1">{restaurant.beach}</p>
                </div>
                <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-1">Телефон</p>
                  <a href={tel} className="text-graphite font-medium hover:underline">{restaurant.phone}</a>
                  <p className="text-sm text-graphite/60 mt-1">Ежедневно {extra.hours}</p>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <img src={restaurant.image} alt={restaurant.name + ' — ресторан в Геленджике'} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 border-y border-graphite/10" style={{ background: accent + '14' }}>
          <div className="max-w-[1400px] mx-auto text-center reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Меню</p>
            <h2 className={H2C + ' mb-6 text-graphite'}>Наше меню</h2>
            <p className="text-graphite/70 font-light text-lg max-w-2xl mx-auto mb-10">
              Авторские блюда от шеф-повара: свежие черноморские продукты, сезонные ингредиенты, {restaurant.cuisine.toLowerCase()}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {menus.map((m) => (
                <a key={m.file} href={m.file} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  {m.label} (PDF)
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Галерея</p>
            <h2 className={H2C + ' text-graphite'}>Атмосфера</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 reveal">
            {gallery.map((src, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
                <img loading="lazy" src={src} alt={restaurant.name + ' — фото ' + (i + 1)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>

        <section id="banquets" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 border-y border-graphite/10" style={{ background: accent + '14' }}>
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Банкеты</p>
              <h2 className={H2C + ' mb-8 text-graphite'}>Мероприятия и банкеты</h2>
              <p className="text-graphite/80 font-light text-lg leading-relaxed mb-8">
                Проведите незабываемый праздник в атмосфере {restaurant.name}. Свадьбы, юбилеи, корпоративы — мы создадим идеальные условия для вашего торжества.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <p className="text-graphite/80 pt-2">До 80 гостей</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </div>
                  <p className="text-graphite/80 pt-2">от 3 500 ₽ на персону</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 11H1l8-8 8 8h-8z" /><path d="M9 13v8" /></svg>
                  </div>
                  <p className="text-graphite/80 pt-2">Оформление, торт, DJ, обслуживание</p>
                </div>
              </div>
              <a href={tel} className="inline-flex px-8 py-3 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>Связаться с менеджером</a>
            </div>
            <div className="reveal">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <img src={gallery[0]} alt={'Банкеты в ' + restaurant.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Отзывы</p>
            <h2 className={H2C + ' text-graphite'}>Гости о нас</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 reveal">
            {extra.reviews.map((r, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-lg border border-graphite/5">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="18" height="18" viewBox="0 0 24 24" fill={accent} stroke={accent} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  ))}
                </div>
                <p className="text-graphite/80 font-light leading-relaxed mb-6">«{r.text}»</p>
                <p className="text-sm font-medium text-graphite">{r.name} · отзыв с Яндекс Карт</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <a href={yandexReviews} target="_blank" rel="noopener noreferrer" className="inline-flex px-8 py-3 text-sm uppercase tracking-widest font-medium border border-graphite/30 text-graphite hover:bg-graphite hover:text-cream transition-colors rounded-full">
              Все отзывы на Яндекс Картах →
            </a>
          </div>
        </section>

        <section id="contacts" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 border-t border-graphite/10">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 reveal">
              <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Контакты</p>
              <h2 className={H2C + ' text-graphite'}>Как нас найти</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 reveal">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-2">Адрес</p>
                  <p className="text-xl font-medium text-graphite">{restaurant.address}</p>
                  <p className="text-graphite/70 mt-1">{restaurant.beach}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-2">Телефон</p>
                  <a href={tel} className="text-xl font-medium text-graphite hover:underline block">{restaurant.phone}</a>
                  <p className="text-graphite/70 mt-1">{restaurant.phoneFree}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-graphite/60 mb-2">Часы работы</p>
                  <p className="text-xl font-medium text-graphite">Ежедневно {extra.hours}</p>
                </div>
                <button onClick={modal.open} className="mt-2 px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>Забронировать стол</button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={'https://yandex.ru/map-widget/v1/?text=' + encodeURIComponent('Геленджик, ' + restaurant.address) + '&z=16'}
                  width="100%" height="100%" style={{ minHeight: 400, border: 0 }} title={'Карта: ' + restaurant.name}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-graphite text-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <img src={restaurant.logo} alt={restaurant.name} className="h-10 w-auto object-contain brightness-0 invert" />
            <p className="text-cream/50 text-sm mt-4 font-light leading-relaxed">{restaurant.tagline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-4">Разделы</p>
            <div className="flex flex-col items-start gap-2.5">
              {NAV.map(([id, label]) => (
                <button key={id} onClick={() => go(id)} className="text-cream/80 hover:text-cream text-sm transition-colors">{label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-4">Контакты</p>
            <p className="text-cream/80 text-sm">{restaurant.address} · {restaurant.beach}</p>
            <a href={tel} className="text-cream/80 hover:text-cream text-sm block mt-2">{restaurant.phone}</a>
            <p className="text-cream/60 text-sm mt-2">Ежедневно {extra.hours}</p>
          </div>
        </div>
        <div className="border-t border-cream/10 py-5 text-center px-6">
          <a href="#/" className="text-[10px] uppercase tracking-[0.3em] text-cream/50 hover:text-cream transition-colors">© 2026 {restaurant.name} · Часть холдинга «История Вкуса»</a>
        </div>
      </footer>
      <BookingModal isOpen={modal.isOpen} onClose={modal.close} />
      <button onClick={modal.open} className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-2xl shadow-black/30 px-8 py-4 text-sm uppercase tracking-widest font-medium text-cream" style={{ background: accent }}>Забронировать стол</button>
    </div>
  );
}
`, 'utf-8');
console.log('✓ RestaurantPage: часы, меню-PDF (3 кнопки), реальные отзывы, галерея из твоих фото');

console.log('\\n✅ Выкатываем: npm run build && git add -A && git commit -m "Страницы ресторанов: меню, отзывы, галереи, часы" && git push');
console.log('⚠ Если в начале вывода были PDF тяжелее 15 МБ — СНАЧАЛА сожми их (ilovepdf.com) и замени файлы, потом пушь!');
console.log('ℹ Добавишь новые фото в gallery/ — просто запусти node setup114.cjs ещё раз и запушь.');