import type { VercelRequest, VercelResponse } from '@vercel/node';
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
  const ref = await gh('/git/ref/heads/main'); if (!ref.ok) return res.status(500).json({ error: 'ref', d: await ref.text() });
  const commitSha = (await ref.json()).object.sha;
  const bc = await gh('/git/commits/' + commitSha); if (!bc.ok) return res.status(500).json({ error: 'basecommit' });
  const baseTree = (await bc.json()).tree.sha;
  const tree: any[] = [];
  for (const c of changes) {
    if (c.del) { tree.push({ path: c.path, mode: '100644', type: 'blob', sha: null }); continue; }
    const content = c.base64 || Buffer.from(c.text || '', 'utf-8').toString('base64');
    const b = await gh('/git/blobs', { method: 'POST', body: { content, encoding: 'base64' } });
    if (!b.ok) return res.status(500).json({ error: 'blob', d: await b.text() });
    tree.push({ path: c.path, mode: '100644', type: 'blob', sha: (await b.json()).sha });
  }
  const t = await gh('/git/trees', { method: 'POST', body: { base_tree: baseTree, tree } });
  if (!t.ok) return res.status(500).json({ error: 'tree', d: await t.text() });
  const cm = await gh('/git/commits', { method: 'POST', body: { message, tree: (await t.json()).sha, parents: [commitSha] } });
  if (!cm.ok) return res.status(500).json({ error: 'commit', d: await cm.text() });
  const up = await gh('/git/refs/heads/main', { method: 'PATCH', body: { sha: (await cm.json()).sha } });
  if (!up.ok) return res.status(500).json({ error: 'refupd', d: await up.text() });
  return res.status(200).json({ ok: true });
}
