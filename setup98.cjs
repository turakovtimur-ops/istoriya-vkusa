const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let holding = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
let data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');
let css = fs.readFileSync(P('src/index.css'), 'utf-8');

// ================= 1) ФОТО В КАРТОЧКАХ =================
// 1a. поле photo в интерфейсе и данных
if (!data.includes('photo?: string;')) {
  data = data.replace('logo?: string;', 'logo?: string;\n  photo?: string;');
}
if (!data.includes('-photo.jpg')) {
  data = data.replace(/roundLogo: '(\/images\/([a-z-]+)\/[^']+)',/g, (m, p1, folder) =>
    m + "\n    photo: '/images/" + folder + '/' + folder + "-photo.jpg',");
}
fs.writeFileSync(P('src/data/holding.ts'), data, 'utf-8');
console.log('✓ данные: поле photo добавлено');

// 1b. карточки: фото вместо лого + фолбэк на стоковое, если файла нет
const mapIdx = holding.indexOf('{restaurants.map');
if (mapIdx !== -1) {
  const win = holding.slice(mapIdx, mapIdx + 6000);
  const newWin = win.replace(/src=\{(\w+)\.logo\}/g,
    "src={$1.photo || $1.image} onError={(e) => { const t = e.currentTarget as HTMLImageElement; if (!t.dataset.fb) { t.dataset.fb = '1'; t.src = $1.image; } }}");
  if (newWin !== win) {
    holding = holding.slice(0, mapIdx) + newWin + holding.slice(mapIdx + 6000);
    console.log('✓ карточки «Четыре характера»: фото вместо лого (фолбэк на стоковое)');
  } else console.log('⚠ карточки: не нашёл src={X.logo} в окне ресторанов');
} else console.log('⚠ карточки: restaurants.map не найден');

// ================= 2) ФУТЕР: центровка подписи =================
const imgIdx = holding.indexOf('src="/images/holding/istoriya-vkusa-logo.png"');
if (imgIdx !== -1) {
  const endMarker = 'Геленджик</p>';
  const endIdx = holding.indexOf(endMarker, imgIdx);
  if (endIdx !== -1 && endIdx - imgIdx < 1500) {
    const tagStart = holding.lastIndexOf('<img', imgIdx);
    const end = endIdx + endMarker.length;
    const block = '<div className="flex flex-col items-center text-center">\n' +
      '            <img src="/images/holding/istoriya-vkusa-logo.png" alt="История Вкуса" className="h-24 lg:h-28 w-auto object-contain" />\n' +
      '            <p className="text-cream/50 text-sm mt-5">Сеть ресторанов и отелей</p>\n' +
      '            <p className="text-cream/50 text-sm mt-1">Геленджик</p>\n' +
      '          </div>';
    holding = holding.slice(0, tagStart) + block + holding.slice(end);
    console.log('✓ футер: лого по центру, подпись в 2 строки с отступом');
  } else console.log('⚠ футер: подпись не найдена');
} else console.log('⚠ футер: лого не найдено');

// ================= 3) КАРТА: метка Астории + зум =================
const idxMap = holding.indexOf('Мы на карте');
if (idxMap !== -1) {
  let win = holding.slice(idxMap, idxMap + 15000);
  const before = win;
  win = win.replace(/(Астория[\s\S]{0,300}?)\[\s*44\.\d+,\s*38\.\d+\s*\]/, '$1[44.555733, 38.064269]');
  if (win !== before) console.log('✓ карта: метка Астории → 44.555733, 38.064269');
  else console.log('⚠ карта: координаты Астории не найдены');
  const b2 = win;
  win = win.replace(/\.setCenter\(([^)]*)\)/g, (m, args) => (args.includes(',') ? m : '.setCenter(' + args + ', 17)'));
  win = win.replace(/\.panTo\(([^)]*)\)/g, (m, args) => (args.includes('{') ? m : '.panTo(' + args + ', { zoom: 17 })'));
  if (win !== b2) console.log('✓ карта: зум 17 при выборе ресторана/партнёра');
  else console.log('⚠ карта: setCenter/panTo не найдены — выведу фрагмент ниже');
  holding = holding.slice(0, idxMap) + win + holding.slice(idxMap + 15000);
} else console.log('⚠ карта: секция не найдена');

// ================= 4) ВАКАНСИИ: ровный низ =================
if (!css.includes('/* setup98 */')) {
  css += '\n/* setup98 */\n#vacancies { padding-bottom: 2.5rem !important; }\n#vacancies .reveal { margin-bottom: 0 !important; }\n';
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ вакансии: убран лишний низ секции');
}

fs.writeFileSync(P('src/pages/Holding.tsx'), holding, 'utf-8');

// ---- фрагмент вакансий для контроля (если низ всё ещё неровный — пришли скрин) ----
const vIdx = holding.indexOf('частью нашей команды');
if (vIdx !== -1) {
  console.log('\n--- фрагмент вакансий (первые 40 строк после заголовка) ---');
  console.log(holding.slice(vIdx, vIdx + 2500).split('\n').slice(0, 40).join('\n'));
}

console.log('\n✅ Готово. Обнови localhost (Cmd+Shift+R) и проверь:');
console.log('   1) «Четыре характера» — фото в карточках (или стоковые, пока нет твоих)');
console.log('   2) футер — лого по центру + 2 строки подписи');
console.log('   3) карта — клик по списку = зум на метку; Астория на своём месте');
console.log('   4) вакансии — низ секции ровный');