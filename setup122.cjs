const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let rp = fs.readFileSync(P('src/sites/RestaurantPage.tsx'), 'utf-8');
const oldBadge = '<span className="text-2xl font-semibold" style={{ color: accent }}>{extra.rating.score}</span>\n                <svg width="18" height="18" viewBox="0 0 24 24" fill={accent} stroke={accent} strokeWidth="1">';
const newBadge = '<span className={\'text-2xl font-semibold \' + cHead}>{extra.rating.score}</span>\n                <svg width="18" height="18" viewBox="0 0 24 24" className={cHead} fill="currentColor" stroke="currentColor" strokeWidth="1">';
if (rp.includes(oldBadge)) {
  rp = rp.split(oldBadge).join(newBadge);
  fs.writeFileSync(P('src/sites/RestaurantPage.tsx'), rp, 'utf-8');
  console.log('✓ бейдж рейтинга теперь контрастный на всех темах');
} else {
  console.log('⚠ бейдж не найден — проверь, что setup121 применялся');
}

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Контрастный бейдж рейтинга" && git push');