import type { VercelRequest, VercelResponse } from '@vercel/node';
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
