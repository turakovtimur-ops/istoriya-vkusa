const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let a = fs.readFileSync(P('src/pages/Admin.tsx'), 'utf-8');
const a0 = a;

// 1) функция загрузки хиро-фото
const fnAnchor = '  const setOv = (key: string, val: string) => {';
const fnNew = `  const uploadHero = async (file: File) => {
    const e = extra[restSel] || (extra[restSel] = { hours: '09:00–00:00', reviews: [], gallery: [] });
    const name = 'hero-' + Date.now() + '.jpg';
    e.overrides = e.overrides || {};
    e.overrides.image = '/images/' + restSel + '/' + name;
    setExtra({ ...extra });
    const b64 = await fileToB64(file);
    await publish('админка: хиро-фото ' + restSel, [
      { path: 'public/images/' + restSel + '/' + name, base64: b64 },
      { path: 'src/data/resto-extra.ts', text: restoText() }
    ]);
  };
` + fnAnchor;
if (a.includes(fnAnchor) && !a.includes('uploadHero')) a = a.split(fnAnchor).join(fnNew);

// 2) блок в вкладке «Рестораны» над часами работы
const uiAnchor = `<div className="space-y-3">
                <p className="text-cream/50 text-xs uppercase tracking-widest">Часы работы</p>`;
const uiNew = `<div className="space-y-3">
                <p className="text-cream/50 text-xs uppercase tracking-widest">Главное фото (первый экран)</p>
                <div className="flex items-center gap-3">
                  <img src={(cur.overrides && cur.overrides.image) || rest0.image} alt="" className="w-24 h-16 object-cover rounded-lg border border-cream/15" />
                  <input type="file" accept="image/*" className="text-xs" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) uploadHero(f); e.target.value = ''; }} />
                </div>
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Часы работы</p>`;
if (a.includes(uiAnchor)) a = a.split(uiAnchor).join(uiNew);

if (a !== a0) {
  fs.writeFileSync(P('src/pages/Admin.tsx'), a, 'utf-8');
  console.log('✓ админка: загрузка главного фото ресторана');
} else {
  console.log('⚠ якоря не найдены — пришли Admin.tsx');
}

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Админка: замена хиро-фото ресторанов"');
console.log('git pull --rebase');
console.log('git push');