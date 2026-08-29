import { MenuItem } from '../types';

export const menuCategories = [
  'Завтраки', 'Закуски', 'Салаты', 'Супы', 'Хачапури', 'Хинкали',
  'Горячие блюда', 'Мясо', 'Рыба и морепродукты', 'Гарниры', 'Десерты', 'Напитки',
] as const;

export const menuItems: MenuItem[] = [
  { id: 'k1', name: 'Хачапури по-аджарски', description: 'Классическая лодочка с сырами и яйцом', weight: '350 г', price: 580, category: 'Хачапури', featured: true },
  { id: 'k2', name: 'Хачапури царский', description: 'С начинкой из трёх видов сыра', weight: '400 г', price: 690, category: 'Хачапури' },
  { id: 'k3', name: 'Хачапури по-мегрельски', description: 'С сулугуни и сливочным маслом', weight: '320 г', price: 540, category: 'Хачапури' },
  { id: 'k4', name: 'Кубдари', description: 'С мясом и специями', weight: '350 г', price: 620, category: 'Хачапури' },
  { id: 'h1', name: 'Хинкали с говядиной и свининой', description: 'Классические с бульоном', weight: '3 шт', price: 285, category: 'Хинкали', featured: true },
  { id: 'h2', name: 'Хинкали с бараниной', description: 'С луком и кинзой', weight: '3 шт', price: 330, category: 'Хинкали' },
  { id: 'h3', name: 'Хинкали с сыром', description: 'С имеретинским сыром', weight: '3 шт', price: 270, category: 'Хинкали' },
  { id: 'z1', name: 'Боул со страчателлой', description: 'Со свежими овощами и зеленью', weight: '280 г', price: 720, category: 'Закуски', featured: true },
  { id: 'z2', name: 'Пхали из свёклы', description: 'С грецким орехом', weight: '150 г', price: 420, category: 'Закуски' },
  { id: 'z3', name: 'Бадриджани', description: 'Баклажаны с ореховой начинкой', weight: '200 г', price: 480, category: 'Закуски' },
  { id: 'z4', name: 'Лаваш с сыром', description: 'Тёплый, с сулугуни', weight: '250 г', price: 490, category: 'Закуски', featured: true },
  { id: 's1', name: 'Фирменный Кинза', description: 'С говядиной и свежими овощами', weight: '200 г', price: 720, category: 'Салаты' },
  { id: 's2', name: 'Тбилиси', description: 'С фасолью, грецким орехом и ткемали', weight: '220 г', price: 580, category: 'Салаты' },
  { id: 'su1', name: 'Харчо', description: 'Густой, пряный, с говядиной', weight: '350 мл', price: 490, category: 'Супы' },
  { id: 'su2', name: 'Чихиртма', description: 'Куриный бульон с яйцом', weight: '350 мл', price: 420, category: 'Супы' },
  { id: 'm1', name: 'Шашлык из баранины', description: 'На мангале с аджикой', weight: '250 г', price: 980, category: 'Мясо', featured: true },
  { id: 'm2', name: 'Цыплёнок чкмерули', description: 'Целиком в сливочно-чесночном соусе', weight: '600 г', price: 1280, category: 'Мясо', featured: true },
  { id: 'm3', name: 'Томлёная баранья лопатка', description: 'В соусе демиглас', weight: '350 г', price: 1450, category: 'Мясо' },
  { id: 'r1', name: 'Барабулька жареная', description: 'С лимоном и зеленью', weight: '250 г', price: 980, category: 'Рыба и морепродукты' },
  { id: 'r2', name: 'Филе дорадо', description: 'На гриле с овощами', weight: '280 г', price: 1180, category: 'Рыба и морепродукты' },
  { id: 'd1', name: 'Медовик', description: 'Многослойный торт со сметанным кремом', weight: '150 г', price: 380, category: 'Десерты' },
  { id: 'd2', name: 'Пахлава', description: 'С грецким орехом и мёдом', weight: '120 г', price: 350, category: 'Десерты' },
  { id: 'n1', name: 'Лимонад домашний', description: 'В оригинальном кувшине', weight: '500 мл', price: 380, category: 'Напитки' },
  { id: 'n2', name: 'Брусничный чай с апельсином', description: 'Согревающий', weight: '400 мл', price: 320, category: 'Напитки' },
  { id: 'n3', name: 'Имбирный чай', description: 'Пряный и ароматный', weight: '400 мл', price: 320, category: 'Напитки' },
];

export const getFeatured = () => menuItems.filter(item => item.featured);
export const getByCategory = (category: string) => menuItems.filter(item => item.category === category);