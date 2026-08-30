import type { VercelRequest, VercelResponse } from '@vercel/node';
const OWNER = 'turakovtimur-ops';
const REPO = 'istoriya-vkusa';
const FILE = 'src/data/news.ts';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const token = req.headers['x-gh-token'] as string;
  const news = req.body.news;
  if (!token) return res.status(401).json({ error: 'no_token' });
  if (!Array.isArray(news)) return res.status(400).json({ error: 'bad_news' });

  const content = `// НОВОСТИ ХОЛДИНГА
// Обновлено через админку ${new Date().toISOString()}
export interface NewsItem {
  id: string;
  date: string;
  tag: string;
  title: string;
  text: string;
}
export const news: NewsItem[] = ${JSON.stringify(news, null, 2)};
`;

  // 1) получаем sha текущего файла (если есть)
  let sha: string | undefined;
  try {
    const meta = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`, {
      headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github+json' }
    });
    if (meta.ok) {
      const j = await meta.json();
      sha = j.sha;
    }
  } catch (e) {}

  // 2) коммитим
  const body: any = {
    message: 'админка: новости обновлены',
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: 'main',
  };
  if (sha) body.sha = sha;
  const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`, {
    method: 'PUT',
    headers: {
      Authorization: 'token ' + token,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'istoriya-vkusa-admin'
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const t = await r.text();
    return res.status(r.status).json({ error: 'gh', detail: t });
  }
  return res.status(200).json({ ok: true });
}
