const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
a = a.split("const r1 = await fetch(B + '/uploads', { method: 'POST', headers: H, body: JSON.stringify({ type }) });")
  .join("const r1 = await fetch(B + '/uploads?type=' + type, { method: 'POST', headers: H });");
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ apply.ts: type в query'); }
else console.log('⚠ apply.ts: якорь не найден');

let m = fs.readFileSync(P('api/max-test.ts'), 'utf-8');
const m0 = m;
m = m.split("const r1 = await fetch(B + '/uploads', { method: 'POST', headers: H, body: JSON.stringify({ type: 'photo' }) });")
  .join("const r1 = await fetch(B + '/uploads?type=photo', { method: 'POST', headers: H });");
if (m !== m0) { fs.writeFileSync(P('api/max-test.ts'), m, 'utf-8'); console.log('✓ max-test: type в query'); }
else console.log('⚠ max-test: якорь не найден');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: type в query для uploads"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 1) Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026');
console.log('   → ждём up1/up2/send все 200 и ФОТО в чате');
console.log('2) Затем тестовая вакансия с фото и партнёр с Excel!');