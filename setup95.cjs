const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ---------- 1) хук: добавляем ВСЕ варианты классов видимости + threshold 0 ----------
fs.writeFileSync(P('src/hooks/useScrollAnimation.ts'), `import { useEffect } from 'react';

const VIS_CLASSES = ['visible', 'revealed', 'on', 'show', 'active', 'in'];

export function useScrollAnimation() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            VIS_CLASSES.forEach((c) => e.target.classList.add(c));
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

    // страховка: всё, что уже в экране, показываем сразу
    setTimeout(observeAll, 300);

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
`, 'utf-8');
console.log('✓ хук: секции снова видны (все классы + threshold 0)');

// ---------- 2) футер: полный лого вместо иконки ----------
let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
if (h.includes('src={holdingBrand.logo} alt="История Вкуса"')) {
  h = h.replace(
    'src={holdingBrand.logo} alt="История Вкуса"',
    'src={holdingBrand.fullLogo} alt="История Вкуса"'
  );
  h = h.replace(
    'src={holdingBrand.fullLogo} alt="История Вкуса" className="h-16 lg:h-20 w-auto object-contain"',
    'src={holdingBrand.fullLogo} alt="История Вкуса" className="h-24 lg:h-28 w-auto object-contain"'
  );
  fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');
  console.log('✓ футер: полный лого (fullLogo), крупнее');
} else {
  console.log('⚠ футер: замена не найдена — пришли скрин футера');
}

console.log('\n✅ Готово. Dev-сервер подхватит сам (HMR). Проверь:');
console.log('   1) главная — все блоки видны (орбита, команда, акции...)');
console.log('   2) футер — полный лого с надписью «ИСТОРИЯ ВКУСА»');