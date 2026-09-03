import { useEffect, useState } from 'react';
import FileField from './FileField';
interface Props { open: boolean; format: string; onClose: () => void; }
const inputCls = 'w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite';
const labelCls = 'text-xs text-muted uppercase tracking-[0.2em] mb-2 block';
export default function EventModal({ open, format, onClose }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', format: '', date: '', guests: '', wishes: '' });
  const [fileName, setFileName] = useState('');
  const [fileWarn, setFileWarn] = useState('');
  const [fileObj, setFileObj] = useState<File | null>(null);
  const toB64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (open) { setForm((f) => ({ ...f, format })); setFileName(''); setFileObj(null); setSubmitted(false); document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open, format]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    let file;
    if ((window as any).ym) (window as any).ym(112073069, 'reachGoal', 'event_sent');
    if (fileObj && fileObj.size <= 3 * 1024 * 1024) file = { name: fileObj.name, base64: await toB64(fileObj) };
    try {
      await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'event', data: { ...form, file }, honeypot: '' }) });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-12">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Мероприятия и кейтеринг</p>
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-3 leading-tight">Заявка: {form.format}</h2>
        <p className="text-muted font-light mb-8 text-sm">Расскажите о событии и прикрепите примеры — так мы предложим точнее.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Имя *</label><input name="field" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Телефон *</label><input name="field" type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Формат</label><select value={form.format} onChange={(e) => set('format', e.target.value)} className={inputCls}><option>Выездной банкет</option><option>Кейтеринг</option><option>Праздники под ключ</option><option>Спонсорство и благотворительность</option><option>Другое</option></select></div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Дата и площадка</label><input name="field" type="text" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="Например: 15 августа, пляж" className={inputCls} /></div>
            <div><label className={labelCls}>Количество гостей</label><input name="field" type="text" value={form.guests} onChange={(e) => set('guests', e.target.value)} placeholder="≈ 50" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Пожелания</label><textarea name="field" rows={3} value={form.wishes} onChange={(e) => set('wishes', e.target.value)} placeholder="Повод, стиль, любимые блюда гостей — всё, что важно" className={inputCls + ' resize-none'} /></div>
          <FileField label="Фото и примеры (как вы хотите видеть, до 3 МБ)" accept=".jpg,.jpeg,.png,.heic,.webp,.pdf" fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); setFileWarn(f && f.size > 3 * 1024 * 1024 ? 'Файл больше 3 МБ — он не прикрепится к заявке' : ''); }} hint="Примеры сервировки, площадки, меню — всё подойдёт" />
          {fileWarn && <p className="text-red-500 text-xs">{fileWarn}</p>}
          <label className="flex items-start gap-3 text-xs text-muted cursor-pointer"><input name="field" type="checkbox" required className="mt-0.5 accent-terra" />Согласен на обработку персональных данных</label>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-2">{submitted ? '✓ Заявка отправлена!' : 'Отправить заявку'}</button>
        </form>
      </div>
    </div>
  );
}
