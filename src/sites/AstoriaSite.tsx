import UniversalRestaurantSite, { RestaurantData } from '../components/UniversalRestaurantSite';

const data: RestaurantData = {
  "id": "astoria",
  "name": "Астория",
  "logo": "/images/astoria-logo.png",
  "cuisine": "Черноморская кухня",
  "slogan": "Три этажа комфортного отдыха",
  "heroImage": "https://images.unsplash.com/photo-1578474846511-04ba559df046?w=1920&q=85",
  "heroSubtitle": "Высокая черноморская кухня.\nАквариум с живыми устрицами.",
  "aboutTitle": "Три этажа\nвида и вкуса.",
  "aboutText": [
    "Астория — ресторан высокой черноморской кухни на первой береговой линии «Садов Морей». Из панорамных окон в любое время года видно Чёрное море и горы.",
    "Астория гордится большим аквариумом с живыми устрицами и другими представителями морской фауны. В тёплое время работает открытая терраса на всех этажах."
  ],
  "facts": [
    {
      "title": "Три этажа",
      "desc": "Терраса на каждом"
    },
    {
      "title": "Живые устрицы",
      "desc": "Прямо из аквариума"
    },
    {
      "title": "Панорама 270°",
      "desc": "Бухта, город, закаты"
    },
    {
      "title": "Высокая кухня",
      "desc": "Авторские блюда"
    }
  ],
  "aboutImage": "https://images.unsplash.com/photo-1590846406792-003e62a4d3d0?w=1200&q=85",
  "aboutQuote": "«Просторы моря\nстали частью ресторана —\nи меню тоже»",
  "dishes": [
    {
      "name": "Фирменные сковородки",
      "desc": "Мидии и рапаны в авторских соусах — восторг гостей",
      "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=85"
    },
    {
      "name": "Живые устрицы",
      "desc": "Ромаринка, Маака, Джоли — прямо из аквариума ресторана",
      "image": "https://images.unsplash.com/photo-1606685511187-c7f0e7e89f0c?w=800&q=85"
    },
    {
      "name": "Таёжная утка",
      "desc": "С брусничным соусом — фирменное горячее от бренд-шефа",
      "image": "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=85"
    }
  ],
  "gallery": [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=85",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=85",
    "https://images.unsplash.com/photo-1592861956120-e524fc73612b?w=600&q=85",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=85",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=85"
  ],
  "reviews": [
    {
      "name": "Марина",
      "text": "Третий год подряд, когда приезжаем в Геленджик, приходим сюда насладиться вкусными блюдами и прекрасным видом на город и море."
    },
    {
      "name": "Ольга",
      "text": "Были у вас 2 раза в июне. Фирменные сковородки с морепродуктами — просто восторг!"
    },
    {
      "name": "Александр",
      "text": "Отмечали юбилей папы 70 лет. Очень уютный красивый ресторан с видом на Геленджикскую бухту. Приветливый персонал!"
    }
  ],
  "address": "Революционная ул., 34",
  "beach": "Пляж «Сады Морей»",
  "phone": "+7 (928) 882-00-40",
  "phoneFree": "8 (800) 201-57-57, доб. 3",
  "colors": {
    "primary": "#F8F5F0",
    "accent": "#C9A961",
    "text": "#1F2429",
    "muted": "#6B6359"
  }
};

export default function AstoriaSite() {
  return <UniversalRestaurantSite data={data} />;
}
