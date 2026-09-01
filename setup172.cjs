const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };

const toHex = (n: number) => {
  const abs = Math.abs(n);
  let hex = abs.toString(16);
  if (n < 0) hex = '-' + hex;
  return hex;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  const hexId = toHex(CHAT_ID);
  const absId = Math.abs(CHAT_ID);
  out.info = { num: CHAT_ID, hex: hexId, abs: absId };
  
  const tries: [string, string, any][] = [
    // Эндпоинт /chats/{id}/messages
    ['chats_num_messages', B + '/chats/' + CHAT_ID + '/messages', { text: '✅ Тест (числовой ID)!' }],
    ['chats_hex_messages', B + '/chats/' + hexId + '/messages', { text: '✅ Тест (hex ID)!' }],
    ['chats_abs_messages', B + '/chats/' + absId + '/messages', { text: '✅ Тест (без минуса)!' }],
    
    // Эндпоинт /messages с разными recipient форматами
    ['recipient_num', B + '/messages', { recipient: { chat_id: CHAT_ID }, text: '✅ Тест!' }],
    ['recipient_hex', B + '/messages', { recipient: { chat_id: hexId }, text: '✅ Тест!' }],
    ['recipient_obj', B + '/messages', { recipient: { id: CHAT_ID, type: 'chat' }, text: '✅ Тест!' }],
    
    // Message object внутри
    ['message_obj', B + '/messages', { chat_id: CHAT_ID, message: { text: '✅ Тест!' } }],
    
    // PUT вместо POST
    ['put_chats', B + '/chats/' + CHAT_ID + '/messages', { text: '✅ Тест!' }],
  ];
  
  for (const [name, url, body] of tries) {
    try {
      const method = name.startsWith('put') ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: H, body: JSON.stringify(body) });
      out[name] = { status: r.status, body: await r.json().catch(() => null) };
      if (r.ok) break;
    } catch (e: any) { out[name] = { error: e.message }; }
  }
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-test.ts: расширенный тест форматов chat_id');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: тест hex-форматов"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026 и пришли JSON!');