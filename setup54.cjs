const fs = require('fs');
const path = require('path');

let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

const marker = 'const [teamIdx, setTeamIdx] = useState(0);';

const effects = `

  // Перезагрузка: всегда старт сверху
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Меню и логотип: плавный скролл БЕЗ смены hash (нет прыжков на главную)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const a = t.closest ? (t.closest('a[href^="#"]') as HTMLAnchorElement | null) : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href === '#/') {
        const cur = window.location.hash;
        if (cur && cur !== '#/' && cur.startsWith('#/')) return; // со страницы ресторана — роутер сам
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(href.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);`;

if (h.includes('scrollRestoration')) {
  console.log('✓ фиксы навигации уже есть');
} else if (h.includes(marker)) {
  h = h.replace(marker, marker + effects);
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
  console.log('✓ навигация: без прыжков, логотип наверх, старт сверху');
} else {
  console.warn('⚠ маркер не найден');
}

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Шаг 1: навигация и логотип" && git push');