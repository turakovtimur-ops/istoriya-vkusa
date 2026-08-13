const fs = require('fs');
const path = require('path');

let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// 1) убираем ранний return из середины компонента
const bad = '\n  if (activeRest) return <RestaurantPage r={activeRest} />;';
if (h.includes(bad)) {
  h = h.replace(bad, '');
  console.log('✓ ранний return убран');
} else console.warn('⚠ ранний return не найден');

// 2) вставляем проверку ПЕРЕД финальным return (после всех хуков)
const ai = h.indexOf('const activeRest');
if (ai !== -1) {
  const ri = h.indexOf('\n  return (', ai);
  if (ri !== -1 && !h.slice(ai, ri).includes('if (activeRest) return')) {
    h = h.slice(0, ri) + '\n  if (activeRest) return <RestaurantPage r={activeRest} />;' + h.slice(ri);
    fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
    console.log('✓ проверка маршрута теперь после всех хуков');
  } else console.warn('⚠ финальный return не найден');
} else console.warn('⚠ activeRest не найден');

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "фикс роутера ресторанов" && git push');