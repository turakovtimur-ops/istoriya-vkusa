const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'components', 'SuppliersBlock.tsx');
let s = fs.readFileSync(p, 'utf-8');

const bad = 'div className="hidden lg:block reveal reveal-delay-1 mb-6">';
if (s.includes(bad)) {
  s = s.replace(bad, '<div className="hidden lg:block reveal reveal-delay-1 mb-6">');
  fs.writeFileSync(p, s, 'utf-8');
  console.log('✓ SuppliersBlock: < на месте');
} else {
  console.warn('⚠ битая строка не найдена — пришлите первые 60 строк файла');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Мобайл: простая адаптивность" && git push');