const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-diag.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOLJDj0bayibcL31_kyOP3-6s84NVL_lrUfuh3fqD15G-lRNnRzdv3IcbTNPNx5dQ-8_FbjtQ1mi';
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const r = await fetch(B + '/chats', { headers: H });
  const body = await r.json().catch(() => null);
  return res.status(200).json({ status: r.status, body });
}
`, 'utf-8');
console.log('✓ api/max-diag.ts: получаем список чатов бота');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: список чатов"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Открой: https://www.istoriya-vkusa.ru/api/max-diag?key=iv2026');
console.log('и ПРИШЛИ JSON целиком!');