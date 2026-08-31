const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('src/data/overrides.ts'), `export function merge<T>(base: T, over: any): T {
  const b: any = base;
  if (over === undefined || over === null) return base;
  if (Array.isArray(over)) return over as unknown as T;
  if (typeof over === 'object' && typeof b === 'object' && b && !Array.isArray(b)) {
    const out: any = { ...b };
    for (const k of Object.keys(over)) out[k] = merge(b[k], over[k]);
    return out as T;
  }
  return over as T;
}
export const OVERRIDES: Record<string, any> = {};
`);
console.log('✓ overrides.ts: merge теперь типизированный (TS7006 уйдут)');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Hover-редактор: фундамент (EditMode, overrides, теги)"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Затем ПРИШЛИ src/pages/Admin.tsx — вставлю вкладку «Редактор»!');