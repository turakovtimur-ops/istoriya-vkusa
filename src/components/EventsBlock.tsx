import { useState } from 'react';
import EventModal from './EventModal';

const services = [
  {
    title: 'Выездной банкет',
    desc: 'Накроем стол любого уровня — на пляже, вилле или офисе. Посуда, подача, сервис под ключ.',
  },
  {
    title: 'Кейтеринг',
    desc: 'Ресторанная кухня на вашей площадке: от кофе-брейков до гастрономических станций.',
  },
  {
    title: 'Праздники под ключ',
    desc: 'Свадьбы, юбилеи, корпоративы и городские события — меню, команда и атмосфера «Истории Вкуса».',
  },
  {
    title: 'Спонсорство и благотворительность',
    desc: 'Благотворительные ужины для юных спортсменов клуба «Спарта», участие в праздниках города с администрацией Геленджика. Добро — часть нашей философии.',
  },
];

export default function EventsBlock() {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState('Выездной банкет');

  const openWith = (f: string) => {
    setFormat(f);
    setOpen(true);
  };

  return (
    <section id="events" className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="reveal mb-10 max-w-3xl">
          <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Мы приедем к вам</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6">Мероприятия и кейтеринг</h2>
          <p className="text-cream/60 font-light text-lg leading-relaxed">
            Нам часто звонят: «Приезжайте к нам!» — и мы приезжаем. Выберите формат и оставьте заявку — можно прикрепить фото и примеры того, что вы хотите видеть.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {services.map((s, i) => (
            <button
              key={s.title}
              onClick={() => openWith(s.title)}
              className="reveal group border border-cream/10 p-6 lg:p-8 hover:border-amber/60 transition-colors text-left"
              style={{ transitionDelay: (i * 0.08) + 's' }}
            >
              <div className="w-10 h-0.5 mb-6 bg-amber" />
              <h3 className="text-2xl font-semibold tracking-tight mb-3 group-hover:text-amber transition-colors">{s.title}</h3>
              <p className="text-cream/60 font-light leading-relaxed mb-6">{s.desc}</p>
              <span className="text-xs uppercase tracking-[0.2em] border-b pb-1 border-cream/30 group-hover:border-amber group-hover:text-amber transition-colors">
                Оставить заявку →
              </span>
            </button>
          ))}
        </div>
        <div className="reveal flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button onClick={() => openWith('Другое')} className="glass-btn inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-medium">
            Обсудить мероприятие
          </button>
          <a href="tel:88002015757" className="text-cream/70 hover:text-cream transition-colors text-sm">
            или позвоните: 8 800 201-57-57
          </a>
        </div>
      </div>

      <EventModal open={open} format={format} onClose={() => setOpen(false)} />
    </section>
  );
}