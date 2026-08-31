export interface Supplier { id: string; name: string; category: string; desc: string; accent: string; logo?: string; site?: string; image?: string }
// партнёры холдинга — редактируется через админку
export const suppliers: Supplier[] = [
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
