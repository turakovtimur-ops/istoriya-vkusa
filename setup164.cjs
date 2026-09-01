const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-diag.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
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
`, 'utf-8');
console.log('✓ api/max-diag.ts создан');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: диагностика API"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Затем открой: https://www.istoriya-vkusa.ru/api/max-diag?key=iv2026');
console.log('и ПРИШЛИ мне то, что покажется на экране (JSON)!');