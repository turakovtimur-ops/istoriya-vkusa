const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ---------- 1) Нино и Астория: photo → .jpg (под реальные файлы) ----------
let data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');
const d0 = data;
data = data.replace("photo: '/images/nino/nino-photo.jpeg'", "photo: '/images/nino/nino-photo.jpg'");
data = data.replace("photo: '/images/astoria/astoria-photo.jpeg'", "photo: '/images/astoria/astoria-photo.jpg'");
if (data !== d0) {
  fs.writeFileSync(P('src/data/holding.ts'), data, 'utf-8');
  console.log('✓ Нино/Астория: photo = .jpg (файлы на месте)');
} else console.log('⚠ данные: строки .jpeg не найдены');

// ---------- 2) Астория: координаты принудительно ----------
let cs = fs.readFileSync(P('src/components/ContactsSection.tsx'), 'utf-8');
const c0 = cs;
cs = cs.replace(/astoria:\s*\[[\d.]+,\s*[\d.]+\]/, 'astoria: [44.555746, 38.064224]');
if (cs !== c0) {
  fs.writeFileSync(P('src/components/ContactsSection.tsx'), cs, 'utf-8');
  console.log('✓ Астория: 44.555746, 38.064224');
} else console.log('⚠ карта: строка astoria не найдена');

console.log('\n✅ Обнови localhost: все 4 карточки с ТВОИМИ фото + Астория на точке.');
console.log('Если всё зелёное — выкатываем: npm run build && git add -A && git commit -m "Финал пакета правок" && git push');