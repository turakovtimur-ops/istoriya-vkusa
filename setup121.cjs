const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) данные новостей =================
if (!fs.existsSync(P('src/data/news.ts'))) {
  fs.writeFileSync(P('src/data/news.ts'), `// НОВОСТИ ХОЛДИНГА
// Чтобы добавить новость — скопируй блок { ... }, вставь его СВЕРХУ списка и поменяй тексты.
// Чтобы убрать новость — удали её блок.
// После правки: npm run build && git add -A && git commit -m "новости" && git push
export interface NewsItem {
  id: string;
  date: string;
  tag: string;
  title: string;
  text: string;
}
export const news: NewsItem[] = [
  {
    id: 'menu-fall-2026',
    date: '1 сентября 2026',
    tag: 'Меню',
    title: 'Осеннее обновление меню',
    text: 'Кинза и Нино вводят новые блюда: сезонные овощи, черноморская рыба и согревающие соусы. Приходите пробовать первыми!',
  },
  {
    id: 'city-day-2026',
    date: '29 августа 2026',
    tag: 'Праздник',
    title: 'С Днём города, Геленджик!',
    text: 'Холдинг «История Вкуса» поздравляет город с праздником! Во всех ресторанах — специальные угощения и сюрпризы для гостей.',
  },
  {
    id: 'ny-2027',
    date: '1 ноября 2026',
    tag: 'Анонс',
    title: 'Открыта бронь новогодних банкетов',
    text: 'Корпоративы и семейные торжества в любом из наших ресторанов. Даты до 31 декабря разбирают быстро — успевайте забронировать!',
  },
];
`, 'utf-8');
  console.log('✓ news.ts создан (3 стартовые новости)');
} else console.log('ℹ news.ts уже есть');

// ================= 2) Holding: пункт меню + секция новостей =================
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
if (!h.includes("import { news }")) {
  h = h.replace("import EventsBlock from '../components/EventsBlock';",
    "import EventsBlock from '../components/EventsBlock';\nimport { news } from '../data/news';");
  // пункт в шапке: после Партнёров, перед Акциями
  h = h.replace("['#partners', 'Партнёры'],", "['#partners', 'Партнёры'],\n    ['#news', 'Новости'],");
  // секция перед Акциями
  const anchor = h.indexOf('<section id="promos"');
  if (anchor !== -1) {
    const newsSection = `<section id="news" className="py-16 lg:py-24 bg-coal">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="reveal mb-10">
        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Новости</p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Новости и анонсы</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((nItem, i) => (
          <article key={nItem.id} className="border border-cream/10 hover:border-cream/30 transition-colors p-7 flex flex-col reveal" style={{ transitionDelay: (i * 0.08) + 's' }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-amber/15 text-amber">{nItem.tag}</span>
              <time className="text-cream/40 text-xs">{nItem.date}</time>
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-3">{nItem.title}</h3>
            <p className="text-cream/60 text-sm font-light leading-relaxed">{nItem.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
  `;
    h = h.slice(0, anchor) + newsSection + h.slice(anchor);
    console.log('✓ секция «Новости» + пункт в шапке');
  }
}
if (h.includes('#promo s')) { h = h.split('#promo s').join('#promos'); console.log('✓ ссылка «Акции» исправлена'); }
fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

// ================= 3) Ken Burns CSS =================
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('kenburns')) {
  css += '\n@keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }\n.kenburns { animation: kenburns 14s ease-in-out infinite alternate; }\n';
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ kenburns CSS');
}

// ================= 4) RestaurantPage: зум, бейдж рейтинга, лого без инверсии =================
let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
if (rp.includes('className="absolute inset-0 w-full h-full object-cover"')) {
  rp = rp.split('className="absolute inset-0 w-full h-full object-cover"').join('className="absolute inset-0 w-full h-full object-cover kenburns"');
  console.log('✓ хиро: живой зум');
}
rp = rp.split("className={'h-10 lg:h-12 w-auto object-contain ' + (dark ? 'brightness-0 invert' : '')}").join('className="h-10 lg:h-12 w-auto object-contain"');
const h2old = "<h2 className={H2C + ' ' + cHead}>Гости о нас</h2>";
if (rp.includes(h2old) && !rp.includes('rating-badge')) {
  rp = rp.split(h2old).join(h2old + "\n            {extra.rating && (\n              <p className={'rating-badge mt-5 inline-flex items-center gap-2 text-sm font-medium ' + cSoft}>\n                <span className=\"text-2xl font-semibold\" style={{ color: accent }}>{extra.rating.score}</span>\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill={accent} stroke={accent} strokeWidth=\"1\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\" /></svg>\n                · {extra.rating.count} отзывов на Яндекс Картах\n              </p>\n            )}");
  console.log('✓ бейдж рейтинга над отзывами');
}
fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');

// ================= 5) рейтинги в resto-extra =================
let re = fs.readFileSync(P('src/data/resto-extra.ts'), 'utf-8');
const i0 = re.indexOf('= {');
const i1 = re.lastIndexOf('};');
if (i0 !== -1 && i1 !== -1) {
  const data = JSON.parse(re.slice(i0 + 2, i1 + 1));
  const R = { kinza: ['4.8', 1261], nino: ['4.8', 447], astoria: ['4.7', 606], 'la-costa': ['4.6', 1105] };
  for (const id of Object.keys(R)) if (data[id]) data[id].rating = { score: R[id][0], count: R[id][1] };
  re = re.slice(0, i0 + 2) + JSON.stringify(data, null, 2) + re.slice(i1 + 1);
  if (!re.includes('rating?:')) {
    re = re.replace('theme?: { pageBg?: string; btn?: string } }', 'theme?: { pageBg?: string; btn?: string }; rating?: { score: string; count: number } }');
  }
  fs.writeFileSync(P('src/data/resto-extra.ts'), re, 'utf-8');
  console.log('✓ рейтинги: Кинза 4.8, Нино 4.8, Астория 4.7, Ла Коста 4.6');
}

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Новости + Ken Burns + рейтинги + лого" && git push');