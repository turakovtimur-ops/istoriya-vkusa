const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ---------- читаем файлы ----------
let holding = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
let css = fs.readFileSync(P('src/index.css'), 'utf-8');

// ---------- 0) класс видимости reveal из CSS ----------
const visMatch = css.match(/\.reveal\.([A-Za-z0-9_-]+)\s*[{,]/) || css.match(/\.reveal\.([A-Za-z0-9_-]+)/);
const VIS = visMatch ? visMatch[1] : 'visible';
console.log('✓ класс видимости reveal:', VIS);

// ---------- 1) useScrollAnimation + MutationObserver (фикс дырок в Акциях) ----------
fs.writeFileSync(P('src/hooks/useScrollAnimation.ts'), `import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('${VIS}');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (!(el as Element).hasAttribute('data-obs')) {
          (el as Element).setAttribute('data-obs', '1');
          io.observe(el);
        }
      });
    };

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
`, 'utf-8');
console.log('✓ useScrollAnimation: новые карточки теперь видны сразу (фикс фильтров)');

// ---------- 2) карусели: вешаем свои классы на контейнеры ----------
function addClassBefore(src, marker, cls) {
  const idx = src.indexOf(marker);
  if (idx === -1) return [src, null];
  const open = src.lastIndexOf('<div className="', idx);
  if (open === -1 || idx - open > 800) return [src, null];
  const q = src.indexOf('"', open + 16);
  return [src.slice(0, q) + ' ' + cls + src.slice(q), src.slice(open, idx)];
}

function sectionIdNear(src, marker) {
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  const back = src.slice(Math.max(0, idx - 3000), idx);
  const m = back.match(/id="([^"]+)"(?=[\s\S]*$)/);
  return m ? m[1] : null;
}

let restId = null, partId = null;
[holding, restId] = (() => { const [h, ctx] = addClassBefore(holding, '{restaurants.map', 'hv-carousel hv-carousel-r'); return [h, ctx]; })();
console.log(holding.includes('hv-carousel-r') ? '✓ рестораны: карусель подключена' : '⚠ рестораны: контейнер не найден');
[holding, partId] = (() => { const [h, ctx] = addClassBefore(holding, '{partners.map', 'hv-carousel hv-carousel-p'); return [h, ctx]; })();
console.log(holding.includes('hv-carousel-p') ? '✓ партнёры: карусель подключена' : '⚠ партнёры: контейнер не найден');
restId = sectionIdNear(holding, 'hv-carousel-r');
partId = sectionIdNear(holding, 'hv-carousel-p');
console.log('✓ id секций:', restId, partId);

// ---------- 3) футер главной: лого вместо текста ----------
const fIdx = holding.indexOf('<footer');
if (fIdx !== -1) {
  const nameIdx = holding.indexOf('>История Вкуса<', fIdx);
  if (nameIdx !== -1 && nameIdx - fIdx < 3000) {
    const tagStart = holding.lastIndexOf('<', nameIdx);
    const closeStart = holding.indexOf('</', nameIdx);
    const closeEnd = holding.indexOf('>', closeStart) + 1;
    holding = holding.slice(0, tagStart) + '<img src={holdingBrand.logo} alt="История Вкуса" className="h-16 lg:h-20 w-auto object-contain" />' + holding.slice(closeEnd);
    console.log('✓ футер: лого вместо текста');
  } else console.log('⚠ футер: текст не найден');
}

// ---------- 4) класс заголовков главной (для шрифтов ресторанов) ----------
const h2m = holding.match(/<h2[^>]*className="([^"]+)"[^>]*>[^<]*(Четыре характера|Люди, которые создают|Сейчас в ресторанах)/);
const H2 = h2m ? h2m[1] : 'text-3xl lg:text-5xl font-bold tracking-tighter';
console.log('✓ класс заголовков главной:', H2);

fs.writeFileSync(P('src/pages/Holding.tsx'), holding, 'utf-8');

// ---------- 5) CSS каруселей ----------
if (!css.includes('/* setup94 */')) {
  const rSel = (restId ? '#' + restId + ' .hv-carousel-r img, ' : '') + '.hv-carousel-r img';
  const pSel = (partId ? '#' + partId + ' .hv-carousel-p img, ' : '') + '.hv-carousel-p img';
  css += `
/* setup94 */
@media (max-width:767px){
  .hv-carousel{display:flex !important;overflow-x:auto !important;scroll-snap-type:x mandatory;gap:16px !important;margin-left:-24px;margin-right:-24px;padding:4px 24px 16px;-webkit-overflow-scrolling:touch;}
  .hv-carousel>*{min-width:86%;max-width:86%;flex-shrink:0 !important;scroll-snap-align:start;}
  ${rSel}{width:100% !important;height:160px !important;object-fit:contain !important;padding:12px;}
  ${pSel}{width:100% !important;height:180px !important;object-fit:cover !important;}
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS каруселей добавлен');
}

// ---------- 6) RestaurantPage: фикс-плашка + шрифты главной ----------
const page = `import { useEffect, useState } from 'react';
import BookingModal from '../components/BookingModal';
import { useModal } from '../hooks/useModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { HoldingRestaurant, holdingBrand } from '../data/holding';

interface Props {
  restaurant: HoldingRestaurant;
}

const NAV: [string, string][] = [
  ['about', 'Ресторан'],
  ['menu', 'Меню'],
  ['gallery', 'Галерея'],
  ['banquets', 'Банкеты'],
  ['reviews', 'Отзывы'],
  ['contacts', 'Контакты'],
];

const H2C = '${H2}';

export default function RestaurantPage({ restaurant }: Props) {
  const modal = useModal();
  const [burger, setBurger] = useState(false);
  useScrollAnimation();
  useDocumentMeta(restaurant.name + ' — ' + restaurant.cuisine + ' | История Вкуса', restaurant.tagline);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const accent = restaurant.accent;
  const tel = 'tel:' + restaurant.phone.replace(/[^0-9+]/g, '');

  const go = (id: string) => {
    setBurger(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* липкая связка: плашка + шапка */}
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
                <button key={id} onClick={() => go(id)} className="text-sm text-graphite/70 hover:text-graphite transition-colors tracking-wide">
                  {label}
                </button>
              ))}
            </nav>
            <div className="hidden lg:flex items-center gap-5">
              <a href={tel} className="text-sm font-medium text-graphite hover:underline whitespace-nowrap">{restaurant.phone}</a>
              <button onClick={modal.open} className="px-6 py-3 text-xs uppercase tracking-widest font-medium text-cream hover:opacity-90 transition-opacity" style={{ background: accent }}>
                Забронировать
              </button>
            </div>
            <button className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5" aria-label="Меню" onClick={() => setBurger(true)}>
              <span className="block w-6 h-px bg-graphite" />
              <span className="block w-6 h-px bg-graphite" />
              <span className="block w-4 h-px bg-graphite" />
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
              <button key={id} onClick={() => go(id)} className="py-3 text-left text-2xl font-bold tracking-tight text-cream/90 border-b border-cream/5">
                {label}
              </button>
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
            <h1 className={'text-4xl lg:text-6xl font-bold tracking-tighter text-cream mb-4 ' + H2C.replace(/text-\S+/g, '').trim()}>{restaurant.name}</h1>
            <p className="text-cream/80 text-lg lg:text-xl font-light max-w-2xl leading-relaxed">{restaurant.tagline}</p>
            <button onClick={modal.open} className="mt-8 self-start px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
              Забронировать стол
            </button>
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
                  <p className="text-sm text-graphite/60 mt-1">{restaurant.phoneFree}</p>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 border-y border-graphite/10" style={{ background: accent + '14' }}>
          <div className="max-w-[1400px] mx-auto text-center reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Меню</p>
            <h2 className={H2C + ' mb-6 text-graphite'}>Наше меню</h2>
            <p className="text-graphite/70 font-light text-lg max-w-2xl mx-auto mb-10">
              Авторские блюда от шеф-повара: свежие продукты, сезонные ингредиенты, {restaurant.cuisine.toLowerCase()}.
            </p>
            <a href="https://disk.yandex.ru" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Скачать меню (PDF)
            </a>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Галерея</p>
            <h2 className={H2C + ' text-graphite'}>Атмосфера</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 reveal">
            {[1537047902294, 1414235077428, 1517248135467, 1552566626, 1559339352, 1544148103].map((n, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
                <img src={'https://images.unsplash.com/photo-' + n + '-62a40c20a6b4?w=800&q=80'} alt={'Фото ' + (i + 1)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
              <a href={tel} className="inline-flex px-8 py-3 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
                Связаться с менеджером
              </a>
            </div>
            <div className="reveal">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80" alt="Банкетный зал" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="scroll-mt-40 py-16 lg:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: accent }}>Отзывы</p>
            <h2 className={H2C + ' text-graphite'}>Гости о нас</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
            {[
              { name: 'Анна М.', text: 'Прекрасная атмосфера, вкусная еда и отличный сервис. Обязательно вернёмся!' },
              { name: 'Дмитрий К.', text: 'Один из лучших ресторанов на побережье. Шеф-повар — мастер своего дела.' },
              { name: 'Елена С.', text: 'Отмечали юбилей — всё было идеально. Спасибо команде!' },
            ].map((r, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-lg border border-graphite/5">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="18" height="18" viewBox="0 0 24 24" fill={accent} stroke={accent} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  ))}
                </div>
                <p className="text-graphite/80 font-light leading-relaxed mb-6">«{r.text}»</p>
                <p className="text-sm font-medium text-graphite">{r.name}</p>
              </div>
            ))}
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
                  <p className="text-xl font-medium text-graphite">Ежедневно 12:00 — 00:00</p>
                </div>
                <button onClick={modal.open} className="mt-2 px-10 py-4 text-sm uppercase tracking-widest font-medium text-cream shadow-lg hover:scale-105 transition-transform" style={{ background: accent }}>
                  Забронировать стол
                </button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={'https://yandex.ru/map-widget/v1/?text=' + encodeURIComponent('Геленджик, ' + restaurant.address) + '&z=15'}
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
            <p className="text-cream/60 text-sm mt-2">Ежедневно 12:00 — 00:00</p>
          </div>
        </div>
        <div className="border-t border-cream/10 py-5 text-center px-6">
          <a href="#/" className="text-[10px] uppercase tracking-[0.3em] text-cream/50 hover:text-cream transition-colors">
            © 2026 {restaurant.name} · Часть холдинга «История Вкуса»
          </a>
        </div>
      </footer>

      <BookingModal isOpen={modal.isOpen} onClose={modal.close} />
      <button onClick={modal.open} className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-2xl shadow-black/30 px-8 py-4 text-sm uppercase tracking-widest font-medium text-cream" style={{ background: accent }}>
        Забронировать стол
      </button>
    </div>
  );
}
`;
fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), page, 'utf-8');
console.log('✓ RestaurantPage: плашка фикс + «← Вернуться в холдинг» + шрифты главной');

console.log('\n✅ ВСЁ ВЫКАТАНО. Дальше:');
console.log('   npm run dev  → проверь по списку ниже');
console.log('   npm run build && git add -A && git commit -m "Пакет правок 1-7" && git push --force');