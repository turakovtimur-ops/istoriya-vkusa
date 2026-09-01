const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-diag.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOLJDj0bayibcL31_kyOP3-6s84NVL_lrUfuh3fqD15G-lRNnRzdv3IcbTNPNx5dQ-8_FbjtQ1mi';
const B = 'https://botapi.max.ru';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const variants: [string, string, Record<string, string>][] = [
    ['q_token', B + '/me?token=' + encodeURIComponent(TOKEN), {}],
    ['q_access', B + '/me?access_token=' + encodeURIComponent(TOKEN), {}],
    ['h_bearer', B + '/me', { Authorization: 'Bearer ' + TOKEN }],
    ['h_raw', B + '/me', { Authorization: TOKEN }],
  ];
  const out: any = {};
  for (const [name, url, headers] of variants) {
    try {
      const r = await fetch(url, { headers });
      out[name] = { status: r.status, body: await r.json().catch(() => null) };
    } catch (e: any) { out[name] = { error: e.message }; }
  }
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-diag.ts: проверка всех способов авторизации');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: диагностика авторизации"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Открой снова: https://www.istoriya-vkusa.ru/api/max-diag?key=iv2026');
console.log('и ПРИШЛИ JSON целиком!');