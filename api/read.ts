import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['x-gh-token'] as string;
  const p = (req.query.path as string) || '';
  if (!token || !p) return res.status(400).json({ error: 'bad_request' });
  const r = await fetch('https://api.github.com/repos/turakovtimur-ops/istoriya-vkusa/contents/' + p, {
    headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'iv-admin' },
  });
  if (!r.ok) return res.status(r.status).json({ error: 'read', d: await r.text() });
  const j = await r.json();
  return res.status(200).json({ text: Buffer.from(j.content, 'base64').toString('utf-8') });
}
