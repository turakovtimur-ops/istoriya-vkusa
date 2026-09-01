import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  const tries: [string, any][] = [
    ['num_chat_id', { chat_id: CHAT_ID, text: '✅ Тест: бот на связи!' }],
    ['str_chat_id', { chat_id: String(CHAT_ID), text: '✅ Тест: бот на связи (строка)!' }],
  ];
  for (const [name, body] of tries) {
    try {
      const r = await fetch(B + '/messages', {
        method: 'POST',
        headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      out[name] = { status: r.status, body: await r.json().catch(() => null) };
      if (r.ok) break;
    } catch (e: any) { out[name] = { error: e.message }; }
  }
  return res.status(200).json(out);
}
