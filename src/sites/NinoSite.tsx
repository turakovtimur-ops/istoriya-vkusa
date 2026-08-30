import UniversalRestaurantSite, { RestaurantData } from '../components/UniversalRestaurantSite';

const data: RestaurantData = {
  "id": "nino",
  "name": "НИНО",
  "logo": "/images/nino-logo.png",
  "cuisine": "Грузинская современная",
  "slogan": "Вкусно! Сочно! По-грузински!",
  "heroImage": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=85",
  "heroSubtitle": "Современная Грузия у яхт-клуба.\nМесто приватности и вкуса.",
  "aboutTitle": "Вкус как\nв Грузии.",
  "aboutText": [
    "НИНО — ресторан современной грузинской кухни у яхт-клуба. В меню собраны хиты Грузии: свежие продукты, тонкий баланс пряностей и настоящие грузинские специи.",
    "Эти шедевры готовят специально приглашённые из Грузии повара. Радушный приём, живая музыка и грузинский колорит сделают посещение незабываемым."
  ],
  "facts": [
    {
      "title": "У яхт-клуба",
      "desc": "Приватность и вид на море"
    },
    {
      "title": "Повара из Грузии",
      "desc": "Специально приглашённые"
    },
    {
      "title": "Живая музыка",
      "desc": "Колорит и атмосфера"
    },
    {
      "title": "Комплимент от шефа",
      "desc": "Каждому гостю"
    }
  ],
  "aboutImage": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=85",
  "aboutQuote": "«Время замедляет ход —\nа ароматы свежей выпечки\nнаполняют воздух»",
  "dishes": [
    {
      "name": "Хинкали с ягнёнком",
      "desc": "Классика гор — сочные, ароматные, ручной лепки",
      "image": "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=800&q=85"
    },
    {
      "name": "Аджарули",
      "desc": "Хачапури-лодочка с яйцом и сулугуни — как в Батуми",
      "image": "https://images.unsplash.com/photo-1565299543923-37dd1788f001?w=800&q=85"
    },
    {
      "name": "Ножка ягнёнка в винном соусе",
      "desc": "Томлёная, тающая во рту, с глубоким вкусом",
      "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=85"
    }
  ],
  "gallery": [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=85",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=85",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=85",
    "https://images.unsplash.com/photo-1592861956120-e524fc73612b?w=600&q=85",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=85",
    "https://images.unsplash.com/photo-1551218807-65265ec3d40b?w=600&q=85"
  ],
  "reviews": [
    {
      "name": "Татьяна Шабаева",
      "text": "Тёплая и дружеская атмосфера, профессионализм. Яркий вид на море и оригинальный интерьер. Все блюда очень вкусны, были поражены комплиментом от шефа!"
    },
    {
      "name": "Дарья Рощупко",
      "text": "Помимо вкусной еды, вкусно было всё: супы, хычин, салат. Принесли комплимент от заведения — вкуснейшую настойку. Обслуживание просто великолепное!"
    }
  ],
  "address": "Революционная ул., 34, корп. 6",
  "beach": "Пляж «Сады Морей»",
  "phone": "+7 (928) 410-03-42",
  "phoneFree": "8 (800) 201-57-57, доб. 4",
  "colors": {
    "primary": "#F5F0E8",
    "accent": "#B8272D",
    "text": "#1A1A1A",
    "muted": "#6B5D4F"
  }
};

export default function NinoSite() {
  return <UniversalRestaurantSite data={data} />;
}
