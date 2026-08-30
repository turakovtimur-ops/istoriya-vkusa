import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'no_password' });
  const hash = createHash('sha256').update(password).digest('hex');
  return res.status(200).json({ ok: true, hash });
}
