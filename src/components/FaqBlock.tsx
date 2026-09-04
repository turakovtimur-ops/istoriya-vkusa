import { useState } from 'react';
const FAQ = [
  { q: 'Можно ли принести свой алкоголь?', a: 'У нас обширная барная и винная карта с большим ассортиментом коктейлей на любой вкус — необходимости приносить свои напитки нет.' },
  { q: 'Есть ли скидка в день рождения?', a: 'В честь дня рождения мы дарим вам десерт и коктейль в подарок 🎁' },
  { q: 'Можно ли приходить с животными?', a: 'Да, мы зоо-friendly: для маленьких питомцев предусмотрены поилки и комплименты 🐾' },
  { q: 'Как забронировать стол?', a: 'Кнопкой «Забронировать» на сайте, по телефону или в MAX/WhatsApp — администратор подтвердит бронь звонком.' },
  { q: 'Есть ли детские стульчики?', a: 'Да, у нас есть детские стульчики и посуда — малышам будет комфортно.' },
  { q: 'Есть ли вегетарианские блюда?', a: 'Да, в меню есть вегетарианские позиции, и часть блюд мы адаптируем под вас — подскажет официант.' },
  { q: 'Принимаете ли карты и СБП?', a: 'Да, принимаем карты, СБП и наличные.' },
];
export default function FaqBlock() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-night py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-3 font-medium text-center">Частые вопросы</p>
        <h2 className="font-serif text-3xl lg:text-5xl font-medium text-cream text-center mb-10">Вопросы и ответы</h2>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <div key={i} className="border border-cream/15 bg-cream/5">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-cream text-sm lg:text-base font-medium">
                {f.q}
                <span className={'text-amber text-xl transition-transform ' + (open === i ? 'rotate-45' : '')}>+</span>
              </button>
              {open === i && <p className="px-6 pb-5 text-cream/70 font-light text-sm lg:text-base leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
        <p className="text-cream/40 text-xs text-center mt-10">Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович</p>
      </div>
    </section>
  );
}
