const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/publish.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const OWNER = 'turakovtimur-ops';
const REPO = 'istoriya-vkusa';
const H = (t: string) => ({ Authorization: 'token ' + t, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'iv-admin' });
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const token = req.headers['x-gh-token'] as string;
  const message = (req.body && req.body.message) || 'админка: правки';
  const changes = (req.body && req.body.changes) || [];
  if (!token || !Array.isArray(changes) || !changes.length) return res.status(400).json({ error: 'bad_request' });
  const gh = (p: string, o: any = {}) => fetch('https://api.github.com/repos/' + OWNER + '/' + REPO + p, { method: o.method || 'GET', headers: H(token), body: o.body ? JSON.stringify(o.body) : undefined });
  for (const c of changes) {
    if (c.del) {
      const meta = await gh('/contents/' + c.path);
      if (meta.ok) {
        const j = await meta.json();
        const d = await gh('/contents/' + c.path, { method: 'DELETE', body: { message: message + ' (удаление)', branch: 'main', sha: j.sha } });
        if (!d.ok) return res.status(d.status).json({ error: 'delete', d: await d.text() });
      }
      continue;
    }
    const content = c.base64 || Buffer.from(c.text || '', 'utf-8').toString('base64');
    let sha: string | undefined;
    const meta = await gh('/contents/' + c.path);
    if (meta.ok) { const j = await meta.json(); sha = j.sha; }
    const body: any = { message, content, branch: 'main' };
    if (sha) body.sha = sha;
    const r = await gh('/contents/' + c.path, { method: 'PUT', body });
    if (!r.ok) return res.status(r.status).json({ error: 'put', d: await r.text() });
  }
  return res.status(200).json({ ok: true });
}
`, 'utf-8');
console.log('✓ api/publish.ts: надёжная публикация (как у новостей)');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Админка: надёжная публикация без GitRPC-ошибок"');
console.log('git pull --rebase');
console.log('git push');