const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  const ch = await fetch(B + '/chats', { headers: H });
  const cj = await ch.json().catch(() => null);
  out.chats = { status: ch.status, body: cj };
  const list = (cj && cj.chats) || [];
  if (list.length) {
    const chat = list.find((c: any) => String(c.title || '').toLowerCase().includes('заявки')) || list[0];
    out.picked = { chat_id: chat.chat_id, title: chat.title };
    try {
      const r = await fetch(B + '/messages', {
        method: 'POST',
        headers: H,
        body: JSON.stringify({ chat_id: chat.chat_id, text: '✅ Тест: бот на связи!' }),
      });
      out.send = { status: r.status, body: await r.json().catch(() => null) };
    } catch (e: any) { out.send = { error: e.message }; }
  } else {
    out.hint = 'Бот не состоит ни в одном чате — добавь его в чат вручную в MAX';
  }
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-test.ts: свежий список чатов + авто-отправка');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: авто-поиск чата"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026 и пришли JSON!');