import { useState } from 'react';

export default function Banquets() {
  const [form, setForm] = useState({ name: '', phone: '', date: '', guests: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: подключение к API / Telegram / CRM
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', phone: '', date: '', guests: '', comment: '' });
  };

  return (
    <section id="banquets" className="py-24 lg:py-40 bg-forest text-cream">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
          <div className="lg:col-span-7">
            <p className="reveal text-terra text-xs tracking-[0.3em] uppercase mb-6 font-medium">Банкеты и мероприятия</p>
            <h2 className="reveal reveal-delay-1 font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] mb-10">
              Праздники,<br /><em>которые хочется<br />запомнить.</em>
            </h2>
            <div className="reveal reveal-delay-2 space-y-5 text-lg font-light leading-relaxed max-w-xl text-cream/85 mb-12">
              <p>Дни рождения, юбилеи, свадьбы, корпоративы, семейные ужины — мы организуем каждое мероприятие так, чтобы оно стало особенным.</p>
              <p>Панорамный зал на 120 гостей, авторское меню от шеф-повара и индивидуальный подход к каждой детали.</p>
            </div>
            <div className="reveal reveal-delay-3 grid grid-cols-2 md:grid-cols-3 gap-6">
              {['Дни рождения','Юбилеи','Свадьбы','Корпоративы','Семейные ужины','Частные мероприятия'].map((item, i) => (
                <div key={i} className="border-l border-cream/30 pl-4 py-1">
                  <p className="font-serif text-xl">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 reveal reveal-delay-2">
            <div className="bg-cream/5 backdrop-blur-sm border border-cream/10 p-8 lg:p-12">
              <h3 className="font-serif text-3xl mb-8">Обсудить мероприятие</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input name="field" type="text" placeholder="Имя" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/30 py-4 text-cream placeholder:text-cream/50 focus:outline-none focus:border-terra transition-colors" />
                <input name="field" type="tel" placeholder="Телефон" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/30 py-4 text-cream placeholder:text-cream/50 focus:outline-none focus:border-terra transition-colors" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="field" type="date" required value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/30 py-4 text-cream focus:outline-none focus:border-terra transition-colors" />
                  <input name="field" type="number" placeholder="Гостей" min="1" required value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full bg-transparent border-b border-cream/30 py-4 text-cream placeholder:text-cream/50 focus:outline-none focus:border-terra transition-colors" />
                </div>
                <textarea name="field" placeholder="Комментарий" rows={3} value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full bg-transparent border-b border-cream/30 py-4 text-cream placeholder:text-cream/50 focus:outline-none focus:border-terra transition-colors resize-none" />
                <button type="submit" className="btn-terra w-full mt-6">
                  {submitted ? '✓ Заявка отправлена' : 'Отправить заявку'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}