import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };
const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  const r1 = await fetch(B + '/uploads?type=image', { method: 'POST', headers: H });
  const j1: any = await r1.json().catch(() => null);
  out.up1 = { status: r1.status };
  if (r1.ok && j1 && j1.url) {
    const buf = Buffer.from(TINY_PNG, 'base64');
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'image/png' }), 'test.png');
    const r2 = await fetch(j1.url, { method: 'POST', body: fd });
    const j2: any = await r2.json().catch(() => null);
    out.up2 = { status: r2.status };
    let token = '';
    const bag = j2 && (j2.photos || j2.files || null);
    if (bag) { const k = Object.keys(bag)[0]; if (k && bag[k] && bag[k].token) token = bag[k].token; }
    out.token_found = !!token;
    const r3 = await fetch(B + '/messages?chat_id=' + CHAT_ID, { method: 'POST', headers: H, body: JSON.stringify({ text: '📎 Тест файла v2', attachments: [{ type: 'image', payload: { token } }] }) });
    out.send = { status: r3.status, body: await r3.json().catch(() => null) };
  }
  return res.status(200).json(out);
}
