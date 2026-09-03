const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const files = [];
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  });
};
walk(P('src'));

let webpCount = 0, nameCount = 0;

files.forEach((p) => {
  let s = fs.readFileSync(p, 'utf-8');
  const s0 = s;

  // ===== 1) WebP для всех Unsplash-картинок =====
  s = s.replace(/https:\/\/images\.unsplash\.com\/[A-Za-z0-9_-]+(\?[^'"`\s)]*)?/g, (m) => {
    if (m.includes('fm=webp')) return m;
    webpCount++;
    return m + (m.includes('?') ? '&fm=webp' : '?fm=webp');
  });

  // ===== 2) name у полей форм без name/id =====
  s = s.replace(/<input\b[^>]*>/g, (tag) => {
    if (/name\s*=/.test(tag) || /id\s*=/.test(tag)) return tag;
    nameCount++;
    return tag.replace('<input', '<input name="field"');
  });
  s = s.replace(/<textarea\b[^>]*>/g, (tag) => {
    if (/name\s*=/.test(tag) || /id\s*=/.test(tag)) return tag;
    nameCount++;
    return tag.replace('<textarea', '<textarea name="field"');
  });

  if (s !== s0) { fs.writeFileSync(p, s, 'utf-8'); console.log('✓ ' + path.relative(P('.'), p)); }
});

console.log('\nWebP-параметров добавлено: ' + webpCount);
console.log('Полям добавлен name: ' + nameCount);

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "WebP для картинок + name у полей форм" && git pull --rebase && git push');