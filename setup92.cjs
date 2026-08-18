const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, 'src', 'hooks');
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

const hookPath = path.join(hooksDir, 'useDocumentMeta.ts');
if (fs.existsSync(hookPath)) {
  console.log('✓ хук уже есть');
} else {
  fs.writeFileSync(hookPath, `import { useEffect } from 'react';

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute('name', 'description');
        document.head.appendChild(m);
      }
      m.setAttribute('content', description);
    }
  }, [title, description]);
}
`, 'utf-8');
  console.log('✓ создан src/hooks/useDocumentMeta.ts');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add -A && git commit -m "фикс: хук useDocumentMeta" && git push --force');