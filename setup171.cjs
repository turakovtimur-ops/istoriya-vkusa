const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  
  // 1) Детали чата (права бота)
  try {
    const r = await fetch(B + '/chats/' + CHAT_ID, { headers: H });
    out.chat_details = { status: r.status, body: await r.json().catch(() => null) };
  } catch (e: any) { out.chat_details = { error: e.message }; }
  
  // 2) Участники чата
  try {
    const r = await fetch(B + '/chats/' + CHAT_ID + '/members', { headers: H });
    out.members = { status: r.status, body: await r.json().catch(() => null) };
  } catch (e: any) { out.members = { error: e.message }; }
  
  // 3) Варианты отправки
  const tries: [string, string, any][] = [
    ['endpoint_chats_id_messages', B + '/chats/' + CHAT_ID + '/messages', { text: '✅ Тест: бот пишет!' }],
    ['recipient_field', B + '/messages', { recipient: { chat_id: CHAT_ID }, text: '✅ Тест!' }],
    ['str_chat_id', B + '/messages', { chat_id: String(CHAT_ID), text: '✅ Тест (строка)!' }],
    ['positive_id', B + '/messages', { chat_id: Math.abs(CHAT_ID), text: '✅ Тест (без минуса)!' }],
  ];
  for (const [name, url, body] of tries) {
    try {
      const r = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(body) });
      out[name] = { status: r.status, body: await r.json().catch(() => null) };
      if (r.ok) break;
    } catch (e: any) { out[name] = { error: e.message }; }
  }
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-test.ts: расширенная диагностика (права + эндпоинты)');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: расширенная диагностика"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026 и пришли JSON!');