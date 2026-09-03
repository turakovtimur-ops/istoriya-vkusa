const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// иконки (пересоздаём на всякий случай)
fs.mkdirSync(P('public/images/social'), { recursive: true });
fs.writeFileSync(P('public/images/social/vk.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#0077FF"/><g transform="translate(4.56 4.56) scale(0.62)"><path fill="#fff" d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.114-3.343 1.043-3.146 1.261.266 1.764 3.19 3.203 3.794.985.414 1.656.326 2.392.287.806-.043 1.345-.262 1.345-.262l-.003-1.502s-.977.077-1.574-.083c-.826-.222-1.365-1.61-2.15-2.263-.373-.311-.468-.506.031-.806.774-.468 2.37-2.346 2.553-3.363.092-.51-.001-.888-.636-.888h-1.952c-.528 0-.773.302-.902.707 0 0-.789 2.12-1.828 3.317-.334.384-.458.484-.655.484-.247 0-.619-.255-.619-.975V9.097c0-.863-.235-1.25-.921-1.25h-3.07c-.515 0-.826.262-.826.628 0 .826 1.238 1.017 1.362 3.343v5.063c0 1.11-.199 1.315-.634 1.315-1.157 0-3.97-4.312-5.609-9.077-.318-.925-.641-1.272-1.171-1.272H2.586c-.604 0-.965.302-.965.628 0 .789 1.017 3.173 4.733 8.504 2.479 3.555 5.972 5.015 6.808 5.015z"/></g></svg>
`, 'utf-8');
fs.writeFileSync(P('public/images/social/max.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4E7CFF"/><stop offset="1" stop-color="#8E5BFF"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#g)"/><path fill="#fff" d="M12 5c-4.42 0-8 2.9-8 6.5 0 2.06 1.16 3.9 2.97 5.1L6.5 19l2.6-1.3c.9.26 1.88.4 2.9.4 4.42 0 8-2.9 8-6.5S16.42 5 12 5z"/></svg>
`, 'utf-8');
console.log('✓ иконки vk.svg + max.svg');

// ===== ищем RestaurantPage =====
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

if (!s.includes('SOCIAL_VK')) {
  s = s.replace(/const geo = \(id: string\) => GEO\[id\] \|\| \[38\.0776, 44\.5611\];/, `const geo = (id: string) => GEO[id] || [38.0776, 44.5611];
const SOCIAL_VK: Record<string, string> = {
  kinza: 'https://vk.ru/kinzagelendzhik',
  nino: 'https://vk.ru/ninogelendzhik',
  astoria: 'https://vk.ru/astoriagelendzhik',
  'la-costa': 'https://vk.ru/lacostabereg',
};
const MAX_LOYALTY_URL = 'https://max.ru/id2370015710_bot';
const KINZA_EDA_URL = 'https://eda.yandex.ru/r/kinza_1721032873?placeSlug=kinza_l37w6';`);
}

if (!s.includes('social-footer')) {
  s = s.replace(/<p className="text-cream\/60 text-sm mt-2">Ежедневно \{extra\.hours\}<\/p>/, `<p className="text-cream/60 text-sm mt-2">Ежедневно {extra.hours}</p>
            <div className="social-footer flex items-center gap-3 mt-5">
              <a href={SOCIAL_VK[restaurant.id]} target="_blank" rel="noopener noreferrer" aria-label={restaurant.name + ' во ВКонтакте'} title="ВКонтакте">
                <img src="/images/social/vk.svg" alt="ВКонтакте" className="w-9 h-9 rounded-xl hover:scale-105 transition-transform" />
              </a>
              <a href={MAX_LOYALTY_URL} target="_blank" rel="noopener noreferrer" aria-label="MAX — программа лояльности" title="MAX · программа лояльности">
                <img src="/images/social/max.svg" alt="MAX" className="w-9 h-9 rounded-xl hover:scale-105 transition-transform" />
              </a>
            </div>`);
}

if (!s.includes('eda-delivery-btn')) {
  s = s.replace(/<button onClick=\{modal\.open\} className="mt-8 self-start px-10 py-4[^"]*" style=\{btnStyle\}>Забронировать стол<\/button>/, `<div className="mt-8 self-start flex flex-wrap items-center gap-4">
            <button onClick={modal.open} className="px-10 py-4 text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={btnStyle}>Забронировать стол</button>
            {restaurant.id === 'kinza' && (
              <a href={KINZA_EDA_URL} target="_blank" rel="noopener noreferrer" className="eda-delivery-btn inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: '#FFD60A', color: '#221c14' }}>
                <img src="/images/kinza/yandex-eda.png" alt="" className="w-6 h-6 rounded-md" />
                Заказать доставку
              </a>
            )}
          </div>`);
}

if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ RestaurantPage: VK+MAX в подвале, кнопка Еды у Кинзы'); }
else console.log('⚠ ничего не изменилось — якоря не совпали');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "VK + MAX в подвале, кнопка Яндекс Еды у Кинзы" && git pull --rebase && git push');