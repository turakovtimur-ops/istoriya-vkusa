const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('src/hooks/useScrollAnimation.ts'), `import { useEffect } from 'react';

const VIS_CLASSES = ['visible', 'revealed', 'on', 'show', 'active', 'in', 'is-visible', 'in-view', 'shown'];

export function useScrollAnimation() {
  useEffect(() => {
    const reveal = (el: Element) => {
      VIS_CLASSES.forEach((c) => el.classList.add(c));
      const h = el as HTMLElement;
      h.style.setProperty('opacity', '1', 'important');
      h.style.setProperty('transform', 'none', 'important');
      h.style.setProperty('visibility', 'visible', 'important');
    };

    const check = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.hasAttribute('data-done')) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) {
          el.setAttribute('data-done', '1');
          reveal(el);
        }
      });
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    // страховка: новые карточки при фильтрах/роутинге
    const t = window.setInterval(check, 400);

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.clearInterval(t);
    };
  }, []);
}
`, 'utf-8');

console.log('✓ хук переписан: без IntersectionObserver, чистый scroll + rect');
console.log('\n✅ Обнови localhost (Cmd+Shift+R) и проскролль главную:');
console.log('   История → Команда → Рестораны → Партнёры → Акции (погоняй фильтры) → … → Футер');