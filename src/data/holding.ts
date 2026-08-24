export interface HoldingRestaurant {
  id: string;
  name: string;
  cuisine: string;
  tagline: string;
  description: string;
  address: string;
  beach: string;
  phone: string;
  phoneFree: string;
  path: string;
  image: string;
  accent: string;
  logo?: string;
  photo?: string;
  roundLogo?: string;
  pattern?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  desc: string;
  address: string;
  phone: string;
  site: string;
  image: string;
  link?: string;
}

export interface PromoItem {
  name: string;
  price: string;
}

export interface Promo {
  id: string;
  title: string;
  restaurants: string[] | 'all';
  note?: string;
  items?: PromoItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  desc: string;
  photo: string;
}

export const holdingBrand = {
  name: 'История Вкуса',
  logo: '/images/holding/istoriya-vkusa-icon.png',
  fullLogo: '/images/holding/istoriya-vkusa-logo.png',
  roundLogo: '/images/holding/istoriya-vkusa-round.png',
    photo: '/images/holding/holding-photo.jpeg',
  gold: '#C2A076',
  blue: '#5B6C8E',
};

export const restaurants: HoldingRestaurant[] = [
  {
    id: 'kinza',
    name: 'Кинза',
    cuisine: 'Грузинская национальная',
    tagline: 'Семейный ресторан у моря с экодизайном. Открытая кухня: хинкали, хачапури и шашлык готовят при вас',
    description: 'Грузинская национальная кухня: мангал, традиционные блюда. Семейный ресторан на берегу моря с экодизайном, открытая кухня — хинкали, хачапури и шашлык готовят при вас. Отборное грузинское вино, лёгкие изысканные коктейли, музыкальное сопровождение очаровательной певицы.',
    address: 'Революционная ул., 22',
    beach: 'Пляж «Багамы»',
    phone: '+7 (938) 409-58-55',
    phoneFree: '8 (800) 201-57-57, доб. 1',
    path: '/kinza',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80',
    accent: '#71B06B',
    logo: '/images/kinza/kinza-logo.png',
    roundLogo: '/images/kinza/kinza-round.png',
    photo: '/images/kinza/kinza-photo.jpeg',
    pattern: '/images/kinza/kinza-pattern.png',
  },
  {
    id: 'nino',
    name: 'Нино',
    cuisine: 'Грузинская современная',
    tagline: 'Ресторан у яхт-клуба, где знают цену приватности. Уединённые столики, премиальные вина и авторские коктейли',
    description: 'Грузинская современная кухня: мангал, эксклюзивные дистилляты. Ресторан на берегу моря, который знает, что такое приватность. Открытая терраса с видом на яхт-клуб, уютные уединённые столики, отгороженные друг от друга. Премиальные грузинские вина, изысканные авторские коктейли.',
    address: 'Революционная ул., 34, корп. 6',
    beach: 'Пляж «Сады Морей»',
    phone: '+7 (928) 410-03-42',
    phoneFree: '8 (800) 201-57-57, доб. 4',
    path: '/nino',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    accent: '#D84C3C',
    logo: '/images/nino/nino-logo.png',
    roundLogo: '/images/nino/nino-round.png',
    photo: '/images/nino/nino-photo.jpg',
    pattern: '/images/nino/nino-pattern.png',
  },
  {
    id: 'astoria',
    name: 'Астория',
    cuisine: 'Черноморская кухня',
    tagline: 'Ресторан высокой кухни. Для тех, кто знает разницу. Лучший вид на бухту, аквариум с живыми морепродуктами, терраса 270°',
    description: 'Черноморская кухня: морепродукты, рыба, стейки. «Ресторан высокой кухни. Для тех, кто знает разницу». Самый лучший вид на Геленджикскую бухту и горный хребет. 3 этажа гастрономии черноморской кухни, аквариум с живыми морепродуктами, 2 летние террасы, банкетный зал, терраса на 3-м этаже с видом на 270 градусов. Эксклюзивный интерьер премиум-сегмента сделает ваш визит аристократичным — потому что вы достойны лучшего!',
    address: 'Революционная ул., 34',
    beach: 'Пляж «Сады Морей»',
    phone: '+7 (928) 882-00-40',
    phoneFree: '8 (800) 201-57-57, доб. 3',
    path: '/astoria',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
    accent: '#C2A076',
    logo: '/images/astoria/astoria-logo.png',
    roundLogo: '/images/astoria/astoria-round.png',
    photo: '/images/astoria/astoria-photo.jpg',
    pattern: '/images/astoria/astoria-pattern.png',
  },
  {
    id: 'la-costa',
    name: 'Ла Коста Берег',
    cuisine: 'Европейская · Черноморская',
    tagline: 'Ресторан с многолетней историей на центральной набережной. Терраса, DJ, живая музыка, танцпол и коктейль-бар',
    description: 'Европейская и черноморская кухня: рыба, мангал, стейки. Ресторан с многолетней историей на центральной набережной: терраса, DJ, живая музыка, танцпол, коктейль-бар, экстрим-коктейли — а если повезёт, шеф-повар лично выяснит ваши предпочтения и приготовит для вас ужин.',
    address: 'Революционная ул., 11',
    beach: 'Пляж «Дельфин»',
    phone: '+7 (938) 433-95-55',
    phoneFree: '8 (800) 201-57-57, доб. 2',
    path: '/la-costa',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80',
    accent: '#349C74',
    logo: '/images/la-costa/la-costa-logo.png',
    roundLogo: '/images/la-costa/la-costa-round.png',
    photo: '/images/la-costa/la-costa-photo.jpeg',
    pattern: '/images/la-costa/la-costa-pattern.png',
  },
];

export const team: TeamMember[] = [
  {
    id: 'manager',
    name: 'Джульетта Атакуева',
    role: 'Управляющая',
    desc: 'Отвечает за гостеприимство во всех проектах «Истории Вкуса». Если ваш вечер прошёл идеально — это она.',
    photo: '/images/team/manager.jpg',
  },
  {
    id: 'chef',
    name: 'Рустам Эшматов',
    role: 'Бренд-шеф',
    desc: 'Автор меню и хранитель стандарта вкуса холдинга. Соединяет черноморский продукт с кавказским характером.',
    photo: '/images/team/chef.jpg',
  },
  {
    id: 'bar',
    name: 'Константин Михеев',
    role: 'Бар-менеджер',
    desc: 'Куратор бара: от отборных грузинских вин до авторских коктейлей и домашних настоек. Подберёт пару к каждому блюду.',
    photo: '/images/team/bar.jpg',
  },
];

export const vacancies = [
  'Администратор',
  'Бармен',
  'Официант',
  'Хостес',
  'Повар',
  'Сотрудник кухни',
  'Клинер',
];

export const benefits = [
  'Официальное трудоустройство',
  'Стабильные выплаты',
  'Бонусы и премии',
  'Бесплатное питание',
  'Форма',
  'Трансфер*',
];

export const partners: Partner[] = [
  {
    id: 'brigantina',
    name: 'Бригантина',
    type: 'Отель',
    desc: 'Отель на первой береговой линии, в 30 метрах от моря. Комфортабельные номера с балконом и видом на море.',
    address: 'Революционная ул., 37',
    phone: '8 (800) 101-90-10, доб. 1',
    site: 'https://brigantina-hotel.ru',
    image: '/images/partners/brigantina.jpg',
  },
  {
    id: 'yantar',
    name: 'Янтарь',
    type: 'Отель',
    desc: 'Уютный отель на первой линии центральной набережной. Просторные номера с большими балконами и видом на море.',
    address: 'Революционная ул., 11',
    phone: '8 (800) 101-90-10, доб. 2',
    site: 'https://yantar-otel.ru',
    image: '/images/partners/yantar.jpg',
  },
  {
    id: 'priroda',
    name: 'Природа',
    type: 'Загородный комплекс',
    desc: 'Загородный комплекс в живописном уголке: 12 минут на машине от Геленджика в сторону Возрождения.',
    address: 'М-4 «Дон», 1501-й км',
    phone: '8 (800) 201-57-57, доб. 5',
    site: 'https://prirodarest.ru',
    image: '/images/partners/priroda.jpg',
  },
];

export const promos: Promo[] = [
  {
    id: 'unity-1',
    title: 'Геленджик — вкус единства',
    restaurants: ['nino', 'kinza'],
    items: [
      { name: 'Кубанская окрошка на кефире с телячьим языком, 450 г', price: '600' },
      { name: 'Гедлибже с курицей, 350 г', price: '1120' },
      { name: 'Осетинский пирог с мясом, 700 г', price: '650' },
    ],
  },
  {
    id: 'unity-2',
    title: 'Геленджик — вкус единства',
    restaurants: ['la-costa', 'astoria'],
    items: [
      { name: 'Кубанская окрошка на кефире с телячьим языком, 450 г', price: '600' },
      { name: 'Таёжная утка с брусничным соусом, 180/30 г', price: '1120' },
      { name: 'Штрудель с яблоком и грушей, 350 г', price: '650' },
    ],
  },
  {
    id: 'future-astoria',
    title: 'Будущее в Астории',
    restaurants: ['astoria'],
    items: [
      { name: 'Осьминог на гриле с печёным картофелем, 100 г', price: '1490' },
      { name: 'Салат с осьминогом, 250 г', price: '2490' },
    ],
  },
  {
    id: 'future-lacosta',
    title: 'Будущее в Ла Коста',
    restaurants: ['la-costa'],
    items: [
      { name: 'Осьминог на гриле с печёным картофелем, 100 г', price: '1490' },
      { name: 'Салат с осьминогом, 230 г', price: '2490' },
      { name: 'Салат с пармской ветчиной и грушей, 250 г', price: '1990' },
      { name: 'Томлёная лопатка ягнёнка в демиглас с беби-картофелем, 1 кг', price: '4990' },
      { name: 'Камамбер из печи с домашним вареньем, 125/30/60 г', price: '890' },
    ],
  },
  {
    id: 'oysters',
    title: 'Фестиваль устриц',
    restaurants: ['la-costa', 'astoria'],
    items: [
      { name: 'Ромаринка (Россия), 6 / 12 шт', price: '990 / 1990' },
      { name: 'Маака (Китай), 1 / 6 / 12 шт', price: '490 / 2490 / 4990' },
      { name: 'Розовая Джоли (ЮАР), 1 / 6 / 12 шт', price: '790 / 3990 / 7990' },
      { name: 'Моари (Юж. Корея), 1 / 6 / 12 шт', price: '690 / 3790 / 7590' },
      { name: 'Элизабет (ЮАР), 1 / 6 / 12 шт', price: '690 / 3790 / 7590' },
    ],
    note: 'Бруни Просекко Брут 0,75 в подарок за 12 шт · Каса ди Родиччи 0,75 за 6 шт',
  },
  {
    id: 'noon',
    title: 'Дегустационный полдень',
    restaurants: 'all',
    note: '−20% с 13:00 до 17:00 на ваши любимые блюда — ведь вы достойны лучшего',
  },
  {
    id: 'beer',
    title: 'Бери два бокала — третий в подарок',
    restaurants: 'all',
    note: 'На всё разливное пиво одного сорта · акция действует до 20:00',
  },
  {
    id: 'barabulya',
    title: 'Барабуля',
    restaurants: 'all',
    note: '290 ₽ за 100 г · черноморское наслаждение — пальчики оближешь',
  },
  {
    id: 'spritz',
    title: 'Сет из 3 коктейлей',
    restaurants: 'all',
    note: '1800 ₽ · Апероль спритц · Ежевика-лаванда · Алоэ-лотос · Персик-бузина-жасмин',
  },
  {
    id: 'tinctures',
    title: 'Ознакомительный сет домашних настоек',
    restaurants: 'all',
    note: '1500 ₽ · 250 мл / 120 г + комплимент от шефа',
  },
];

export const history = {
  title: 'Четыре ресторана — одна история',
  paragraphs: [
    '«История Вкуса» — ресторанный холдинг, в котором у каждого проекта свой характер, но общая философия: принимать гостей так, как принимают близких.',
    'Четыре ресторана, партнёрские отели и загородный комплекс — мы создаём места, куда хочется возвращаться: за кухней, атмосферой и морем.',
  ],
  stats: [
    { value: '4', label: 'ресторана' },
    { value: '3', label: 'партнёра' },
    { value: '1', label: 'философия гостеприимства' },
  ],
};
