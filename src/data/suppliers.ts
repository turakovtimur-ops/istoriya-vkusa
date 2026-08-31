export interface Supplier { id: string; name: string; category: string; desc: string; accent: string; logo?: string; site?: string; image?: string }
// партнёры холдинга — редактируется через админку
export const suppliers: Supplier[] = [
  {
    "id": "baltika",
    "name": "Балтика",
    "category": "Бар и напитки",
    "desc": "Разливное пиво и стаут для всех ресторанов холдинга",
    "accent": "#1E4E8C",
    "site": "https://baltika.com"
  },
  {
    "id": "martini",
    "name": "Мартини",
    "category": "Бар и напитки",
    "desc": "Вермуты и игристые для коктейльных и винных карт",
    "accent": "#7A2E3B",
    "site": "https://www.martini.com"
  },
  {
    "id": "zozulya",
    "name": "Зозуля",
    "category": "Кухня и продукты",
    "desc": "Свежие овощи и фрукты — каждый день на наших кухнях",
    "accent": "#349C74"
  },
  {
    "id": "marchenko",
    "name": "Марченко",
    "category": "Кухня и продукты",
    "desc": "Бакалея и сухие продукты для всех четырёх ресторанов",
    "accent": "#B85A3C"
  },
  {
    "id": "city",
    "name": "Администрация Геленджика",
    "category": "Город и события",
    "desc": "Вместе делаем праздники города — участвуем во всех ключевых событиях курорта",
    "accent": "#C2A076",
    "site": "https://admgel.ru/",
    "logo": "/images/suppliers/admgel.png"
  },
  {
    "id": "s1788162464112",
    "name": "Флагман",
    "category": "Сервис и оборудование",
    "desc": "Типография «Флагман» выполняет полный цикл рекламных услуг: от дизайна до монтажа и доставки. Мы заслужили доверие клиентов благодаря высокому качеству работы.",
    "accent": "#5B4B8A",
    "site": "https://gelengik.flagman-print.ru/",
    "logo": "/images/suppliers/s1788162464112.jpg"
  }
];
