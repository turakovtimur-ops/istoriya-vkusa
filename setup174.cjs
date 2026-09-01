const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) max-test: правильный формат из доки =================
fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const r = await fetch(B + '/messages?chat_id=' + CHAT_ID, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '✅ Тест: бот на связи! Формат отправки исправлен по документации.' }),
  });
  return res.status(200).json({ status: r.status, body: await r.json().catch(() => null) });
}
`, 'utf-8');
console.log('✓ api/max-test.ts: chat_id в query, text в body');

// ================= 2) apply.ts: тот же фикс =================
let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
a = a.split("const r = await fetch(B + '/messages', {").join("const r = await fetch(B + '/messages?chat_id=' + CHAT_ID, {");
a = a.split("body: JSON.stringify({ chat_id: CHAT_ID, text }),").join("body: JSON.stringify({ text }),");
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ api/apply.ts: отправка по документации'); }
else console.log('⚠ api/apply.ts: якоря не найдены — проверь вручную');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: chat_id в query по документации"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 1) Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026 → ждём status 200');
console.log('2) Глянь в чат MAX — должно прилететь «✅ Тест: бот на связи!»');
console.log('3) Отправь тестовую анкету с сайта — карточка 👔 упадёт в чат!');