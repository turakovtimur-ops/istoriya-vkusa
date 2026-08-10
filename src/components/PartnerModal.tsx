import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileField from './FileField';

interface Props { open: boolean; onClose: () => void; }

const inputCls = 'w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite';
const labelCls = 'text-xs text-muted uppercase tracking-[0.2em] mb-2 block';

export default function PartnerModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ company: '', person: '', phone: '', email: '', category: 'Продукты и кухня', offer: '', comment: '' });
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: отправка на сервер / в Telegram / на почту
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-12"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors" aria-label="Закрыть">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Стать партнёром</p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-3 leading-tight">Заявка на сотрудничество</h2>
            <p className="text-muted font-light mb-8">Размещение на площадке холдинга, реклама, бартер. Прикрепите прайс или презентацию — мы изучим и свяжемся.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Компания *</label>
                  <input type="text" required value={form.company} onChange={(e) => set('company', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Контактное лицо *</label>
                  <input type="text" required value={form.person} onChange={(e) => set('person', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Телефон *</label>
                  <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Категория</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                  <option>Продукты и кухня</option>
                  <option>Напитки и бар</option>
                  <option>Оборудование и техника</option>
                  <option>Сервис и обслуживание</option>
                  <option>Другое</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Что предлагаете *</label>
                <textarea rows={3} required value={form.offer} onChange={(e) => set('offer', e.target.value)} placeholder="Коротко о продукте или услуге и условиях" className={inputCls + ' resize-none'} />
              </div>
              <FileField
                label="Прайс или презентация (PDF, Excel)"
                accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.ppt,.pptx"
                fileName={fileName}
                onFile={setFileName}
              />
              <label className="flex items-start gap-3 text-xs text-muted cursor-pointer">
                <input type="checkbox" required className="mt-0.5 accent-terra" />
                Согласен на обработку персональных данных
              </label>
              <button type="submit" disabled={submitted} className="btn-terra w-full mt-2">
                {submitted ? '✓ Заявка отправлена!' : 'Отправить заявку'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}