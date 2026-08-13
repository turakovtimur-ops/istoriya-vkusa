import UniversalRestaurantSite, { RestaurantData } from '../components/UniversalRestaurantSite';

const data: RestaurantData = {
  "id": "la-costa",
  "name": "Ла Коста Берег",
  "logo": "/images/lacosta-logo.png",
  "cuisine": "Европейская · Черноморская",
  "slogan": "Восхитительные коктейли и прекрасный вид",
  "heroImage": "https://images.unsplash.com/photo-1540914123045-651cb8244620?w=1920&q=85",
  "heroSubtitle": "Набережная, закаты, живая музыка.\nМесто с многолетней историей.",
  "aboutTitle": "Закаты над бухтой\nпрямо из-за стола.",
  "aboutText": [
    "Ла Коста Берег — ресторан с многолетней историей на центральной набережной. Свежий ветерок, лучи солнца на морской глади и дразнящий аромат шашлыка.",
    "Богатое мясное меню, коктейль-бар, живая музыка и танцпол. Любоваться волнами Чёрного моря можно с летней веранды или сидя у окна."
  ],
  "facts": [
    {
      "title": "Центральная набережная",
      "desc": "Первая линия"
    },
    {
      "title": "Живая музыка",
      "desc": "DJ и танцпол"
    },
    {
      "title": "Закаты",
      "desc": "Прямо из-за стола"
    },
    {
      "title": "Мясное меню",
      "desc": "Стейки, шашлык, мангал"
    }
  ],
  "aboutImage": "https://images.unsplash.com/photo-1574971046566-1d21f5d5d7a7?w=1200&q=85",
  "aboutQuote": "«Свежий ветер,\nзакаты над бухтой\nи живая музыка\nу самого моря»",
  "dishes": [
    {
      "name": "Брускетты",
      "desc": "Отдельный вид кулинарного искусства — лёгкие и свежие",
      "image": "https://images.unsplash.com/photo-1572695157366-5e585ab2cc68?w=800&q=85"
    },
    {
      "name": "Стейки на мангале",
      "desc": "Чистая радость для любителей мяса по демократичному ценнику",
      "image": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=85"
    },
    {
      "name": "Авторские коктейли",
      "desc": "Восхитительная коктейльная карта у самого моря",
      "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=85"
    }
  ],
  "gallery": [
    "https://images.unsplash.com/photo-1574971046566-1d21f5d5d7a7?w=600&q=85",
    "https://images.unsplash.com/photo-1540914123045-651cb8244620?w=600&q=85",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=85",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=85",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=85",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85"
  ],
  "reviews": [
    {
      "name": "Ольга Пленкина",
      "text": "Любим вечерние танцы и дневной кофе. Живая музыка душевная и хорошее обслуживание. Закаты из кафе чудесны и изобильны."
    },
    {
      "name": "Инна Дубовицкая",
      "text": "Уютно, вкусно, приятная атмосфера, живая музыка. Одно из немногих оживлённых мест Геленджика."
    },
    {
      "name": "Татьяна Терзян",
      "text": "Прекрасный персонал, учли все пожелания, разместили на террасе, несмотря на дождь, по нашей просьбе!"
    }
  ],
  "address": "Революционная ул., 11",
  "beach": "Пляж «Дельфин»",
  "phone": "+7 (938) 433-95-55",
  "phoneFree": "8 (800) 201-57-57, доб. 2",
  "colors": {
    "primary": "#FFFFFF",
    "accent": "#0891B2",
    "text": "#1E3A4C",
    "muted": "#64748B"
  }
};

export default function LaCostaSite() {
  return <UniversalRestaurantSite data={data} />;
}
