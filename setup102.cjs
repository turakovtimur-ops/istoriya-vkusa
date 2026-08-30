const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) КОМАНДЕ ВЕРНУТЬ .jpg =================
let data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');
const dBefore = data;
data = data.replace(/(\/images\/team\/[^']+)\.jpeg'/g, "$1.jpg'");
if (data !== dBefore) {
  fs.writeFileSync(P('src/data/holding.ts'), data, 'utf-8');
  console.log('✓ команда: фото снова .jpg');
} else console.log('⚠ команда: .jpeg не найден');

// ================= 2) КАРТОЧКИ: надёжный компонент с двойным фолбэком =================
let holding = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');

const oldImg = '<img src={r.photo || r.image} alt={r.name} loading="lazy" onError={(e) => { const t = e.currentTarget as HTMLImageElement; if (!t.dataset.fb) { t.dataset.fb = "1"; t.src = r.image; } }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />';
if (holding.includes(oldImg)) {
  holding = holding.split(oldImg).join('<RestCardPhoto r={r} />');
  console.log('✓ карточки: подключён RestCardPhoto');
} else console.log('⚠ карточки: старый img не найден');

const comp = `function RestCardPhoto({ r }: { r: (typeof restaurants)[number] }) {
  const [stage, setStage] = useState(0);
  const srcs = ([r.photo, r.image, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80'] as (string | undefined)[]).filter(Boolean) as string[];
  const src = srcs[Math.min(stage, srcs.length - 1)];
  return (
    <img
      src={src}
      alt={r.name}
      loading="lazy"
      onError={() => setStage((s) => Math.min(s + 1, srcs.length - 1))}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
    />
  );
}

`;
if (!holding.includes('function RestCardPhoto')) {
  const anchor = 'function FloatingButtons';
  const idx = holding.indexOf(anchor);
  if (idx !== -1) {
    holding = holding.slice(0, idx) + comp + holding.slice(idx);
    console.log('✓ компонент RestCardPhoto добавлен');
  } else console.log('⚠ точка вставки компонента не найдена');
}

fs.writeFileSync(P('src/pages/Holding.tsx'), holding, 'utf-8');

// ================= 3) КАРТА: координаты Астории + зум по клику =================
let cs = fs.readFileSync(P('src/components/ContactsSection.tsx'), 'utf-8');
const cBefore = cs;
cs = cs.replace('astoria: [44.555733, 38.064269],', 'astoria: [44.555746, 38.064224],');
cs = cs.replace(
  'onMouseEnter={() => { const c = RESTAURANTS[r.id]; if (c) zoomTo(r.id, c); }}',
  'onMouseEnter={() => { const c = RESTAURANTS[r.id]; if (c) zoomTo(r.id, c); }}\n                  onClick={() => { const c = RESTAURANTS[r.id]; if (c) zoomTo(r.id, c); }}'
);
cs = cs.replace(
  'onMouseEnter={() => zoomTo(p.id, p.coords)}',
  'onMouseEnter={() => zoomTo(p.id, p.coords)}\n                  onClick={() => zoomTo(p.id, p.coords)}'
);
if (cs !== cBefore) {
  fs.writeFileSync(P('src/components/ContactsSection.tsx'), cs, 'utf-8');
  console.log('✓ карта: Астория 44.555746, 38.064224 + зум по клику');
} else console.log('⚠ карта: замены не найдены');

console.log('\n✅ Обнови localhost (Cmd+Shift+R) и проверь:');
console.log('   1) Рустам и Константин с фото');
console.log('   2) Нино и Астория — фото/сток, без пустых блоков');
console.log('   3) Кинза и Ла Коста — твои фото');
console.log('   4) карта: hover И клик по любому ресторану → зум; Астория на новом месте');