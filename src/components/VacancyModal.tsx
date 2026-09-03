import { useEffect, useState } from 'react';
import { restaurants, vacancies } from '../data/holding';
import FileField from './FileField';
interface Props { vacancy: string | null; onClose: () => void; }
const inputCls = 'w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite';
const labelCls = 'text-xs text-muted uppercase tracking-[0.2em] mb-2 block';
export default function VacancyModal({ vacancy, onClose }: Props) {
  const [mode, setMode] = useState<'form' | 'file'>('form');
  const [form, setForm] = useState({ name: '', phone: '', email: '', position: '', place: 'Любой', experience: 'Не требуется', employment: 'Полная занятость', medbook: 'Нет', citizenship: 'Российская Федерация', patent: '', job1: '', job2: '', start: '', about: '' });
  const [fileName, setFileName] = useState('');
  const [fileWarn, setFileWarn] = useState('');
  const [fileObj, setFileObj] = useState<File | null>(null);
  const toB64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (vacancy) { setForm((f) => ({ ...f, position: vacancy })); document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [vacancy]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    let file;
    if ((window as any).ym) (window as any).ym(112073069, 'reachGoal', 'vacancy_sent');
    if (fileObj && fileObj.size <= 3 * 1024 * 1024) file = { name: fileObj.name, base64: await toB64(fileObj) };
    try {
      await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'vacancy', data: { ...form, file }, honeypot: '' }) });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };
  if (!vacancy) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-12">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors z-10" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Анкета соискателя</p>
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-6 leading-tight">Присоединяйтесь к команде</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <button type="button" onClick={() => setMode('form')} className={'px-5 py-4 border text-left text-sm transition-all ' + (mode === 'form' ? 'border-terra bg-terra/10 text-graphite font-medium' : 'border-graphite/20 text-muted hover:border-graphite/50')}>✍️ Заполнить анкету<span className="block text-xs font-light mt-1 opacity-70">10 коротких вопросов</span></button>
          <button type="button" onClick={() => setMode('file')} className={'px-5 py-4 border text-left text-sm transition-all ' + (mode === 'file' ? 'border-terra bg-terra/10 text-graphite font-medium' : 'border-graphite/20 text-muted hover:border-graphite/50')}>📎 Приложить готовую анкету<span className="block text-xs font-light mt-1 opacity-70">Фото, резюме или файл анкеты</span></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>ФИО *</label><input name="field" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Телефон *</label><input name="field" type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Должность *</label><select required value={form.position} onChange={(e) => set('position', e.target.value)} className={inputCls}>{vacancies.map((v) => (<option key={v} value={v}>{v}</option>))}</select></div>
            <div><label className={labelCls}>Заведение</label><select value={form.place} onChange={(e) => set('place', e.target.value)} className={inputCls}><option>Любой</option>{restaurants.map((r) => (<option key={r.id}>{r.name}</option>))}<option>Природа (загородный комплекс)</option></select></div>
          </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Гражданство *</label>
          <select required value={form.citizenship} onChange={(e) => set('citizenship', e.target.value)} className={inputCls}>
            <option>Российская Федерация</option>
            <option>Республика Белоруссия</option>
            <option>Туркменистан</option>
            <option>Армения</option>
            <option>Казахстан</option>
          </select>
        </div>
      </div>
      {form.citizenship !== 'Российская Федерация' && (
        <div className="border border-terra/30 bg-terra/5 p-5 space-y-4">
          <p className="text-xs text-muted leading-relaxed">
            {['Республика Белоруссия', 'Армения', 'Казахстан'].includes(form.citizenship)
              ? 'ℹ️ Граждане стран ЕАЭС (Беларусь, Армения, Казахстан) работают в РФ без патента — на основании договора о ЕАЭС.'
              : '⚠️ Гражданам Туркменистана для работы в РФ требуется патент на работу.'}
          </p>
          <div>
            <label className={labelCls}>Патент / разрешение на работу в РФ</label>
            <div className="flex flex-wrap gap-5 pt-1">
              <label className="flex items-center gap-2 text-sm text-graphite cursor-pointer">
                <input type="radio" name="patent" required checked={form.patent === 'Да, есть'} onChange={() => set('patent', 'Да, есть')} className="accent-terra" /> Да, есть
              </label>
              <label className="flex items-center gap-2 text-sm text-graphite cursor-pointer">
                <input type="radio" name="patent" required checked={form.patent === 'Нет, готов(а) оформить'} onChange={() => set('patent', 'Нет, готов(а) оформить')} className="accent-terra" /> Нет, готов(а) оформить
              </label>
            </div>
          </div>
        </div>
      )}
          {mode === 'form' ? (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Email</label><input name="field" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} /></div>
                <div><label className={labelCls}>Опыт работы</label><select value={form.experience} onChange={(e) => set('experience', e.target.value)} className={inputCls}><option>Не требуется</option><option>До 1 года</option><option>1–3 года</option><option>Более 3 лет</option></select></div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Занятость</label><select value={form.employment} onChange={(e) => set('employment', e.target.value)} className={inputCls}><option>Полная занятость</option><option>Частичная занятость</option><option>Сменный график</option><option>Подработка</option></select></div>
                <div><label className={labelCls}>Медкнижка</label><select value={form.medbook} onChange={(e) => set('medbook', e.target.value)} className={inputCls}><option>Нет</option><option>Есть</option><option>В процессе оформления</option></select></div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Последнее место работы · необязательно</label>
          <input name="field" type="text" value={form.job1} onChange={(e) => set('job1', e.target.value)} placeholder="Заведение и должность" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>До этого · необязательно</label>
          <input name="field" type="text" value={form.job2} onChange={(e) => set('job2', e.target.value)} placeholder="Заведение и должность" className={inputCls} />
        </div>
      </div>
      <div><label className={labelCls}>Когда готовы приступить</label><input name="field" type="text" value={form.start} onChange={(e) => set('start', e.target.value)} placeholder="Например: с 1 числа следующего месяца" className={inputCls} /></div>
              <div><label className={labelCls}>О себе</label><textarea name="field" rows={3} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Пара слов о себе и почему вам у нас понравится" className={inputCls + ' resize-none'} /></div>
              <FileField label="Фото или резюме (необязательно, до 3 МБ)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic" fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); setFileWarn(f && f.size > 3 * 1024 * 1024 ? 'Файл больше 3 МБ — он не прикрепится к заявке' : ''); }} />
            </>
          ) : (
            <>
              <FileField label="Готовая анкета, резюме или фото (до 3 МБ)" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.heic" required fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); setFileWarn(f && f.size > 3 * 1024 * 1024 ? 'Файл больше 3 МБ — он не прикрепится к заявке' : ''); }} hint="Прикрепите файл — и мы сами всё прочитаем" />
              <div><label className={labelCls}>Пара слов о себе</label><textarea name="field" rows={3} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Кем работали, что умеете — одной строкой" className={inputCls + ' resize-none'} /></div>
            </>
          )}
          {fileWarn && <p className="text-red-500 text-xs">{fileWarn}</p>}
          <label className="flex items-start gap-3 text-xs text-muted cursor-pointer"><input name="field" type="checkbox" required className="mt-0.5 accent-terra" />Согласен на обработку персональных данных</label>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-2">{submitted ? '✓ Анкета отправлена!' : 'Отправить'}</button>
        </form>
      </div>
    </div>
  );
}
