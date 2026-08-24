const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');
const before = data;

// Кинза: битый сток → рабочий
data = data.replace('https://images.unsplash.com/photo-1537047902294-62a40c20a6b4?w=900&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=80');

// Ла Коста: любой текущий unsplash в блоке la-costa → рабочий
data = data.replace(/(id: 'la-costa'[\s\S]{0,700}?)image: 'https:\/\/images\.unsplash\.com\/[^']+'/,
  '$1image: \'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80\'');

if (data !== before) {
  fs.writeFileSync(P('src/data/holding.ts'), data, 'utf-8');
  console.log('✓ стоки Кинзы и Ла Косты заменены на рабочие');
} else {
  console.log('⚠ не нашёл что заменить — пришли строки image из holding.ts');
}

console.log('\n✅ Обнови localhost — все 4 карточки должны быть с фото.');
console.log('Потом положишь СВОИ фото (kinza-photo.jpg и т.д.) — они перекроют сток автоматически.');