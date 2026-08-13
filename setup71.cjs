const fs = require('fs');
const path = require('path');

const make = (compName, data) =>
  "import UniversalRestaurantSite, { RestaurantData } from '../components/UniversalRestaurantSite';\n\nconst data: RestaurantData = " +
  JSON.stringify(data, null, 2) +
  ";\n\nexport default function " + compName + "() {\n  return <UniversalRestaurantSite data={data} />;\n}\n";

const ninoData = {
  id: 'nino', name: 'НИНО', logo: '/images/nino-logo.png', cuisine: 'Грузинская современная',
  slogan: 'Вкусно! Сочно! По-грузински!',
  heroImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=85',
  heroSubtitle: 'Современная Грузия у яхт-клуба.\nМесто приватности и вкуса.',
  aboutTitle: 'Вкус как\nв Грузии.',
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
  aboutQuote: '«Время замедляет ход —\nа ароматы свежей выпечки\nнаполняют воздух»',
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
};

const astoriaData = {
  id: 'astoria', name: 'Астория', logo: '/images/astoria-logo.png', cuisine: 'Черноморская кухня',
  slogan: 'Три этажа комфортного отдыха',
  heroImage: 'https://images.unsplash.com/photo-1578474846511-04ba559df046?w=1920&q=85',
  heroSubtitle: 'Высокая черноморская кухня.\nАквариум с живыми устрицами.',
  aboutTitle: 'Три этажа\nвида и вкуса.',
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
  aboutQuote: '«Просторы моря\nстали частью ресторана —\nи меню тоже»',
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
};

const lacostaData = {
  id: 'la-costa', name: 'Ла Коста Берег', logo: '/images/lacosta-logo.png', cuisine: 'Европейская · Черноморская',
  slogan: 'Восхитительные коктейли и прекрасный вид',
  heroImage: 'https://images.unsplash.com/photo-1540914123045-651cb8244620?w=1920&q=85',
  heroSubtitle: 'Набережная, закаты, живая музыка.\nМесто с многолетней историей.',
  aboutTitle: 'Закаты над бухтой\nпрямо из-за стола.',
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
  aboutQuote: '«Свежий ветер,\nзакаты над бухтой\nи живая музыка\nу самого моря»',
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
};

fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'NinoSite.tsx'), make('NinoSite', ninoData), 'utf-8');
console.log('✓ NinoSite');
fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'AstoriaSite.tsx'), make('AstoriaSite', astoriaData), 'utf-8');
console.log('✓ AstoriaSite');
fs.writeFileSync(path.join(__dirname, 'src', 'sites', 'LaCostaSite.tsx'), make('LaCostaSite', lacostaData), 'utf-8');
console.log('✓ LaCostaSite');

let app = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf-8');
if (app.includes('NinoSite')) {
  console.log('✓ App.tsx уже обновлён');
} else {
  app = app.replace(
    "import KinzaSite from './sites/KinzaSite';",
    "import KinzaSite from './sites/KinzaSite';\nimport NinoSite from './sites/NinoSite';\nimport AstoriaSite from './sites/AstoriaSite';\nimport LaCostaSite from './sites/LaCostaSite';"
  );
  app = app.replace("if (route.startsWith('/nino')) return <RestaurantStub path=\"/nino\" />;", "if (route.startsWith('/nino')) return <NinoSite />;");
  app = app.replace("if (route.startsWith('/astoria')) return <RestaurantStub path=\"/astoria\" />;", "if (route.startsWith('/astoria')) return <AstoriaSite />;");
  app = app.replace("if (route.startsWith('/la-costa')) return <RestaurantStub path=\"/la-costa\" />;", "if (route.startsWith('/la-costa')) return <LaCostaSite />;");
  fs.writeFileSync(path.join(__dirname, 'src', 'App.tsx'), app, 'utf-8');
  console.log('✓ App.tsx: роутинг на новые сайты');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "3 новых сайта ресторанов" && git push');