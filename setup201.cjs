const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let target = null;
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes('export default function RestaurantPage')) target = p;
  });
};
walk(P('src'));
if (!target) { console.log('⚠ RestaurantPage не найден'); process.exit(1); }
console.log('✓ найден: ' + target);

let s = fs.readFileSync(target, 'utf-8');
const s0 = s;

const newBlock = `<div className="mt-6 self-stretch md:self-start flex flex-col md:flex-row items-stretch md:items-center gap-2.5 md:gap-4 max-w-md md:max-w-none">
            <button onClick={modal.open} className="px-6 md:px-10 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={btnStyle}>Забронировать стол</button>
            {restaurant.id === 'kinza' && (
              <a href={KINZA_EDA_URL} target="_blank" rel="noopener noreferrer" className="eda-delivery-btn inline-flex items-center justify-center gap-2.5 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: '#FFD60A', color: '#221c14' }}>
                <img src="/images/kinza/yandex-eda.png" alt="" className="w-5 h-5 md:w-6 md:h-6 rounded-md" />
                Заказать доставку
              </a>
            )}
            <a href={MAX_LOYALTY_URL} target="_blank" rel="noopener noreferrer" className="loyalty-btn inline-flex items-center justify-center gap-2.5 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: 'rgba(17,17,17,0.55)', color: '#f5efe6', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <img src="/images/social/max.png" alt="" className="w-5 h-5 md:w-6 md:h-6 rounded-md" />
              Система лояльности
            </a>
          </div>`;

s = s.replace(/<div className="mt-8 self-start flex flex-wrap items-center gap-4">[\s\S]*?<\/a>\s*<\/div>/, () => newBlock);

if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ hero-кнопки: компактные, одной ширины, в красной зоне'); }
else console.log('⚠ блок кнопок не найден — пришли скрин');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Hero: компактные кнопки одной ширины на мобильных" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ (если что): git revert HEAD --no-edit && git push');