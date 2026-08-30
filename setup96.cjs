const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ---------- 1) хук: принудительный показ инлайн-стилями ----------
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

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (!el.hasAttribute('data-obs')) {
          el.setAttribute('data-obs', '1');
          io.observe(el);
        }
      });
    };

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(observeAll, 300);

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
`, 'utf-8');
console.log('✓ хук: секции показываются инлайн-стилями (не зависит от имени класса)');

// ---------- 2) для контроля: печатаю все reveal-правила из CSS ----------
const css = fs.readFileSync(P('src/index.css'), 'utf-8');
const rules = css.split('\n').filter((l) => l.includes('.reveal'));
console.log('--- reveal-правила в index.css ---');
console.log(rules.join('\n') || '(ничего не найдено)');

console.log('\n✅ Обнови localhost — секции главной должны появиться.');