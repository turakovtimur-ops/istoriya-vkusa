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

const iEda = s.indexOf('eda-delivery-btn');
const iLoy = s.indexOf('loyalty-btn');
if (iEda === -1 || iLoy === -1) { console.log('⚠ маркеры кнопок не найдены'); process.exit(1); }

const start = s.lastIndexOf('<div className=', iEda);
const endA = s.indexOf('</a>', iLoy);
const end = s.indexOf('</div>', endA);
if (start === -1 || end === -1) { console.log('⚠ границы блока не найдены'); process.exit(1); }

console.log('--- старый блок (150 символов): ' + s.slice(start, start + 150).replace(/\n/g, ' '));

const newBlock = `<div className="mt-6 self-stretch md:self-start flex flex-col md:flex-row items-stretch gap-2.5 md:gap-4 w-full md:max-w-5xl">
            <button onClick={modal.open} className="w-full md:w-auto md:flex-1 inline-flex items-center justify-center gap-2.5 md:gap-3 px-4 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform text-center" style={btnStyle}>Забронировать стол</button>
            {restaurant.id === 'kinza' && (
              <a href={KINZA_EDA_URL} target="_blank" rel="noopener noreferrer" className="eda-delivery-btn w-full md:w-auto md:flex-1 inline-flex items-center justify-center gap-2.5 md:gap-3 px-4 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: '#FFD60A', color: '#221c14' }}>
                <img src="/images/kinza/yandex-eda.png" alt="" className="w-5 h-5 md:w-6 md:h-6 rounded-md" />
                Заказать доставку
              </a>
            )}
            <a href={MAX_LOYALTY_URL} target="_blank" rel="noopener noreferrer" className="loyalty-btn w-full md:w-auto md:flex-1 inline-flex items-center justify-center gap-2.5 md:gap-3 px-4 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: 'rgba(17,17,17,0.55)', color: '#f5efe6', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <img src="/images/social/max.png" alt="" className="w-5 h-5 md:w-6 md:h-6 rounded-md" />
              Система лояльности
            </a>
          </div>`;

s = s.slice(0, start) + newBlock + s.slice(end + '</div>'.length);
fs.writeFileSync(target, s, 'utf-8');
console.log('✓ блок кновок переписан целиком: мобилка столбиком, веб — равные в ряд');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Hero: кнопки одной ширины на десктопе" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');