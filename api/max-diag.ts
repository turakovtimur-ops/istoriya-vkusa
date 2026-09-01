import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOLJDj0bayibcL31_kyOP3-6s84NVL_lrUfuh3fqD15G-lRNnRzdv3IcbTNPNx5dQ-8_FbjtQ1mi';
const B = 'https://botapi.max.ru';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  try {
    const me = await fetch(B + '/me?token=' + encodeURIComponent(TOKEN));
    out.me = { status: me.status, body: await me.json().catch(() => null) };
  } catch (e: any) { out.me = { error: e.message }; }
  try {
    const ch = await fetch(B + '/chats?token=' + encodeURIComponent(TOKEN));
    out.chats = { status: ch.status, body: await ch.json().catch(() => null) };
  } catch (e: any) { out.chats = { error: e.message }; }
  return res.status(200).json(out);
}
