import { useState, useEffect } from 'react';
import { BookingForm } from '../types';
const REST_NAMES: Record<string, string> = { kinza: 'Кинза', nino: 'Нино', astoria: 'Астория', 'la-costa': 'Ла Коста Берег' };
interface Props { isOpen: boolean; onClose: () => void; }
export default function BookingModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<BookingForm>({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'booking', data: { ...form, restaurant: REST_NAMES[(window.location.pathname.split('/')[1] || '')] || '' }, honeypot: '' }),
      });
    } catch (e) { }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setForm({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' });
    }, 3000);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-14">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors z-10" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Бронирование</p>
        <h2 className="font-serif text-4xl lg:text-5xl font-medium text-graphite mb-3 leading-tight">Забронировать стол</h2>
        <p className="text-muted font-light mb-10">Мы свяжемся с вами для подтверждения</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Имя</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Телефон</label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Дата</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Время</label>
              <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Гостей</label>
              <select value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>
                ))}
                <option value={0}>Больше 10</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Комментарий</label>
            <textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Пожелания, повод, особенности..." className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite resize-none" />
          </div>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-8">
            {submitted ? '✓ Заявка принята!' : 'Забронировать'}
          </button>
          <p className="text-xs text-muted text-center mt-4">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
        </form>
      </div>
    </div>
  );
}
