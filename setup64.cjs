const fs = require('fs');
const path = require('path');

// ================= ДАННЫЕ СТРАНИЦ =================
const data = `export const REST_PAGES: Record<string, any> = {
  kinza: {
    slogan: 'Любимый ресторан на берегу Чёрного моря',
    about: [
      'КИНZA — ресторан грузинской национальной кухни. Здесь приятно не только завтракать, обедать или ужинать, но и просто проводить время, поглядывая в огромного размера окна и рассматривая детали интерьера.',
      'Гостеприимство складывается из множества незаметных и точных деталей, словно дорогая скатерть, сотканная из тысячи разноцветных нитей. Семейный ресторан у моря с экодизайном и открытой кухней.',
    ],
    features: ['Огромные окна с видом на море', 'Экодизайн и семейная атмосфера', 'Открытая кухня: готовят при вас'],
    dishes: [
      { name: 'Хинкали', desc: 'Лепим вручную: с ягнёнком, сулугуни и классические — сочные, с тонким балансом пряностей' },
      { name: 'Хачапури по-аджарски', desc: 'Легендарная «лодочка» с яйцом и сулугуни — прямо из печи' },
      { name: 'Шашлык на мангале', desc: 'Жарим всё! Аромат открытого огня и фирменные маринады' },
      { name: 'Лаваш с сыром', desc: 'Нежный, горячий, по старинным рецептам — любимец гостей' },
      { name: 'Боул со страчателлой', desc: 'Современная интерпретация кавказской кухни от шефа' },
    ],
    reviews: [
      { name: 'Ксения Бондарчук', text: 'Вкусный ресторан в новом стиле. Фьюжн кухня с перевесом в кавказские блюда. Мне очень понравился боул со страчателлой и хинкали.' },
      { name: 'Евгений Я.', text: 'Сегодня зашли на ужин. Бомбически!!! Девушкам понравился супер нежный лаваш с сыром. Всё крайне вкусно!' },
      { name: 'Игорь', text: 'Просто супер! Еда вкуснейшая, официант Алексей красавчик, профессионал. Понравилось всё. Рекомендую всем!' },
    ],
  },
  nino: {
    slogan: 'Вкусно! Сочно! По-грузински!',
    about: [
      'НИНО — ресторан грузинской современной кухни у яхт-клуба. В меню собраны хиты Грузии: свежие продукты, тонкий баланс пряностей и настоящие грузинские специи. Эти шедевры готовят специально приглашённые из Грузии повара.',
      'Радушный приём, уютная обстановка, живая музыка и грузинский колорит сделают посещение незабываемым. Здесь время замедляет ход, а в воздухе витают ароматы свежей домашней выпечки.',
    ],
    features: ['У яхт-клуба: приватность и уединение', 'Повара, приглашённые из Грузии', 'Живая музыка и грузинский колорит'],
    dishes: [
      { name: 'Хинкали с ягнёнком', desc: 'Классика гор — сочные, ароматные, ручной лепки' },
      { name: 'Аджарули', desc: 'Хачапури-лодочка с яйцом и сулугуни — как в Батуми' },
      { name: 'Хычины и батумский стрит-фуд', desc: 'Сытные, горячие, с пылу с жару' },
      { name: 'Ножка карачаевского бычка', desc: 'Томлёная в печи — блюдо от шефа' },
      { name: 'Ножка ягнёнка в винном соусе', desc: 'Томлёная, тающая во рту, с глубоким вкусом' },
    ],
    reviews: [
      { name: 'Татьяна Шабаева', text: 'Тёплая и дружеская атмосфера, профессионализм и отзывчивость. Яркий вид на море и оригинальный интерьер. Все блюда очень вкусны, были поражены комплиментом от шефа!' },
      { name: 'Дарья Рощупко', text: 'Помимо вкусной еды, вкусно было всё: супы, хычин, салат. Принесли комплимент от заведения — вкуснейшую настойку. Обслуживание просто великолепное!' },
    ],
  },
  astoria: {
    slogan: 'Три этажа комфортного отдыха и вкусной еды',
    about: [
      'Астория — ресторан высокой черноморской кухни на первой береговой линии «Садов Морей». Из панорамных окон в любое время года видно Чёрное море и горы — просторы моря стали частью ресторана.',
      'Астория гордится большим аквариумом с живыми устрицами и другими представителями морской фауны. В тёплое время работает открытая терраса на всех этажах — с невероятным видом на море, город и закаты.',
    ],
    features: ['Три этажа и терраса на каждом', 'Аквариум с живыми устрицами', 'Панорамный вид на бухту, 270°'],
    dishes: [
      { name: 'Фирменные сковородки с морепродуктами', desc: 'Восторг гостей — черноморские мидии и рапаны в авторских соусах' },
      { name: 'Живые устрицы', desc: 'Прямо из аквариума ресторана — Ромаринка, Маака, Джоли' },
      { name: 'Авторская черноморская кухня', desc: 'Блюда разработаны для гурманов, желающих отведать вкус моря' },
      { name: 'Таёжная утка с брусничным соусом', desc: 'Фирменное горячее от бренд-шефа холдинга' },
      { name: 'Штрудель с яблоком и грушей', desc: 'Идеальное завершение ужина с видом на закат' },
    ],
    reviews: [
      { name: 'Марина', text: 'Третий год подряд, когда приезжаем в Геленджик, приходим сюда насладиться вкусными блюдами и прекрасным видом на город и море.' },
      { name: 'Ольга', text: 'Были у вас 2 раза в июне. Фирменные сковородки с морепродуктами — просто восторг!' },
      { name: 'Александр', text: 'Отмечали юбилей папы 70 лет. Очень уютный красивый ресторан с видом на Геленджикскую бухту. Приветливый персонал!' },
    ],
  },
  'la-costa': {
    slogan: 'Восхитительные коктейли, вкуснейшая еда и прекрасный вид на море',
    about: [
      'Ла Коста Берег — ресторан с многолетней историей на центральной набережной. Свежий ветерок, лучи солнца, сверкающие на морской глади, и дразнящий аромат свежеприготовленного шашлыка — мечты сбываются здесь.',
      'Богатое мясное меню, коктейль-бар, живая музыка и танцпол. Любоваться волнами Чёрного моря можно с летней веранды или сидя у окна — закаты из кафе чудесны.',
    ],
    features: ['Центральная набережная, первая линия', 'Терраса, DJ, живая музыка, танцпол', 'Закаты над бухтой прямо из-за стола'],
    dishes: [
      { name: 'Брускетты', desc: 'Отдельный вид кулинарного искусства — лёгкие и свежие' },
      { name: 'Стейки и мясо на мангале', desc: 'Чистая радость для любителей мяса по демократичному ценнику' },
      { name: 'Пицца', desc: 'Ведь пиццы много не бывает' },
      { name: 'Блины с начинкой', desc: 'Любимое лакомство в русских традициях' },
      { name: 'Авторские коктейли', desc: 'Восхитительная коктейльная карта у самого моря' },
    ],
    reviews: [
      { name: 'Ольга Пленкина', text: 'Любим вечерние танцы и дневной кофе. Живая музыка душевная и хорошее обслуживание. Закаты из кафе чудесны и изобильны.' },
      { name: 'Инна Дубовицкая', text: 'Уютно, вкусно, приятная атмосфера, живая музыка. Одно из немногих оживлённых мест Геленджика.' },
      { name: 'Татьяна Терзян', text: 'Прекрасный персонал, учли все пожелания, разместили на террасе, несмотря на дождь, по нашей просьбе!' },
    ],
  },
};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'restPages.ts'), data, 'utf-8');
console.log('✓ данные страниц ресторанов');

// ================= КОМПОНЕНТ СТРАНИЦЫ =================
const page = `import { REST_PAGES } from '../data/restPages';

export default function RestaurantPage({ r }: { r: any }) {
  const p = REST_PAGES[r.id];
  const a = (r.accent as string) || '#C2A076';
  return (
    <div className="min-h-screen bg-night text-cream">
      <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
        <div className="max-w-[1400px] mx-auto glass-bar rounded-full px-5 py-3 flex items-center justify-between">
          <a href="#/" className="text-cream/70 text-[10px] uppercase tracking-[0.2em] hover:text-cream transition-colors">← В холдинг</a>
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: a }}>{r.cuisine}</span>
        </div>
      </header>

      <section className="relative overflow-hidden pt-32 pb-14 px-5">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 35%, ' + a + '22, transparent 70%)' }} />
        <div className="relative max-w-[1100px] mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-white" style={{ border: '1px solid ' + a + '66', boxShadow: '0 0 40px ' + a + '44' }}>
            <img src={r.logo} alt={r.name} className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-4">{r.name}</h1>
          <p className="text-lg md:text-2xl text-cream/70 font-light">{p.slogan}</p>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: a }}>О ресторане</p>
          {p.about.map((t: string, i: number) => (
            <p key={i} className="text-cream/70 font-light leading-relaxed mb-4">{t}</p>
          ))}
          <div className="flex flex-wrap gap-2 mt-6">
            {p.features.map((f: string) => (
              <span key={f} className="glass-chip px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-cream/80">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-8">Фирменное меню</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {p.dishes.map((d: any) => (
              <div key={d.name} className="border border-cream/10 p-6" style={{ background: 'linear-gradient(160deg,' + a + '0d, transparent 60%)' }}>
                <p className="font-semibold tracking-tight mb-1">{d.name}</p>
                <p className="text-cream/55 text-sm font-light">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-8">Гости говорят</h2>
          <div className="space-y-4">
            {p.reviews.map((rv: any) => (
              <div key={rv.name} className="border border-cream/10 p-6 rounded-2xl">
                <p className="text-cream/70 text-sm font-light leading-relaxed mb-3">«{rv.text}»</p>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: a }}>— {rv.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-[900px] mx-auto border border-cream/10 p-8 text-center" style={{ background: a + '0a' }}>
          <p className="text-cream/70 font-light mb-2">{r.address} · {r.beach}</p>
          <p className="text-cream/70 font-light mb-6">{r.phone} · {r.phoneFree}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={'tel:' + String(r.phone).replace(/[^+\\d]/g, '')} className="px-6 py-3 text-xs uppercase tracking-[0.2em] rounded-full font-semibold" style={{ background: a, color: '#0E0D0B' }}>Позвонить</a>
            <a href="#/" className="glass-chip px-6 py-3 text-xs uppercase tracking-[0.2em] text-cream/80">Карта холдинга</a>
          </div>
        </div>
      </section>
    </div>
  );
}
`;
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'RestaurantPage.tsx'), page, 'utf-8');
console.log('✓ компонент страницы ресторана');

// ================= РОУТЕР В HOLDING =================
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

if (h.includes('RestaurantPage')) {
  console.log('✓ роутер уже есть');
} else {
  h = h.replace(
    "import { useEffect, useRef, useState } from 'react';",
    "import { useEffect, useRef, useState } from 'react';\nimport RestaurantPage from '../components/RestaurantPage';"
  );
  const marker = 'const touchX = useRef<number | null>(null);';
  const router = `

  // Страницы ресторанов по hash
  const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  useEffect(() => {
    const onHash = () => { setRoute(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const curRoute = route.replace(/^#/, '');
  const activeRest = restaurants.find((r) => curRoute === r.path || curRoute === '/' + r.path);
  if (activeRest) return <RestaurantPage r={activeRest} />;`;
  if (h.includes(marker)) {
    h = h.replace(marker, marker + router);
    fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
    console.log('✓ роутер страниц ресторанов');
  } else console.warn('⚠ маркер touchX не найден');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Страницы 4 ресторанов" && git push');