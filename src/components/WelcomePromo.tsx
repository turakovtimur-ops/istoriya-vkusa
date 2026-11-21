import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
const LS = 'iv_promo_shown';
export default function WelcomePromo() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [state, setState] = useState<'form' | 'card' | 'used' | 'err'>('form');
  const [qr, setQr] = useState('');
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [errText, setErrText] = useState('');
  const fired = useRef(false);
  useEffect(() => {
    if (localStorage.getItem(LS)) return;
    const show = () => { if (fired.current || localStorage.getItem(LS)) return; fired.current = true; setOpen(true); };
    const t = setTimeout(show, 20000);
    const onScroll = () => { if (window.scrollY > 120) { show(); window.removeEventListener('scroll', onScroll); } };
    window.addEventListener('scroll', onScroll);
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);
  useEffect(() => { if (code) QRCode.toDataURL(code, { margin: 1, width: 320 }).then(setQr).catch(() => setQr('')); }, [code]);
  const close = () => { setOpen(false); localStorage.setItem(LS, '1'); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const r = await fetch('/api/promo/issue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.code) { setCode(j.code); setState('card'); }
      else if (j.used) setState('used');
      else { setErrText(j.error === 'day_limit' ? 'С этого адреса сегодня уже выдано 2 промокода. Попробуйте завтра или с другого интернета.' : j.error === 'rate_limit' ? 'Слишком много попыток — подождите 10 минут.' : j.error === 'bad_phone' ? 'Проверьте номер телефона.' : 'Не получилось. Попробуйте позже.'); setState('err'); }
    } catch { setErrText('Нет связи с сервером. Попробуйте позже.'); setState('err'); }
    finally { setBusy(false); }
  };
  const buildCanvas = async () => {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
    const x = c.getContext('2d')!;
    const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, '#171310'); g.addColorStop(1, '#0b0a08'); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
    x.strokeStyle = 'rgba(194,160,118,.5)'; x.lineWidth = 3; x.strokeRect(40, 40, 1000, 1270);
    x.textAlign = 'center';
    x.fillStyle = '#C2A076'; x.font = '600 34px Arial'; x.fillText('ИСТОРИЯ ВКУСА', 540, 150);
    x.fillStyle = '#F5F2EA'; x.font = '700 96px Arial'; x.fillText('−10%', 540, 300);
    x.font = '400 40px Arial'; x.fillStyle = 'rgba(245,242,234,.85)'; x.fillText('на первый визит в любой ресторан сети', 540, 370);
    x.font = '700 78px Arial'; x.fillStyle = '#C2A076'; x.fillText(code, 540, 520);
    if (qr) { const img = new Image(); img.src = qr; await new Promise((r) => { img.onload = r; }); x.drawImage(img, 340, 580, 400, 400); }
    x.fillStyle = 'rgba(245,242,234,.7)'; x.font = '400 32px Arial';
    x.fillText('Промокод одноразовый · без срока · не суммируется с акциями', 540, 1080);
    x.fillText('Покажи эту картинку администратору', 540, 1140);
    return c;
  };
  const openPreview = async () => { const c = await buildCanvas(); setPreview(c.toDataURL('image/png')); };
  const saveImage = async () => {
    const c = await buildCanvas();
    const blob: Blob | null = await new Promise((res) => c.toBlob(res, 'image/png'));
    if (!blob) { openPreview(); return; }
    const name = 'promo-' + code + '.png';
    const file = new File([blob], name, { type: 'image/png' });
    const nav = navigator as any;
    if (nav.canShare && nav.canShare({ files: [file] })) {
      try { await nav.share({ files: [file], title: 'Промокод −10%' }); return; }
      catch (e: any) { if (e && e.name === 'AbortError') return; }
    }
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) { setPreview(URL.createObjectURL(blob)); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(code); };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={close}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-3xl bg-cream p-8 text-graphite shadow-2xl">
        <button onClick={close} aria-label="Закрыть" className="absolute top-4 right-4 text-graphite/60 hover:text-terra">✕</button>
        {state !== 'card' && (<>
          <p className="text-terra text-xs tracking-[0.3em] uppercase mb-3">Добро пожаловать</p>
          <h2 className="text-3xl font-semibold mb-3">Рады видеть вас в «Истории Вкуса»!</h2>
          <p className="text-graphite/70 mb-6">Дарим −10% на первый визит в любой ресторан сети. Оставьте телефон — пришлём персональный промокод.</p>
          {state === 'used' && <p className="text-terra font-medium mb-4">Ваш промокод уже использован. Повторно коды не выдаём.</p>}
          {state === 'err' && <p className="text-terra font-medium mb-4">{errText}</p>}
          <form onSubmit={submit} className="space-y-4">
            <input name="field" required type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/70 border border-graphite/15 rounded-xl px-4 py-3 focus:outline-none focus:border-terra" />
            <button disabled={busy} type="submit" className="btn-terra w-full rounded-full">{busy ? 'Секунду…' : 'Получить промокод'}</button>
          </form>
        </>)}
        {state === 'card' && (<>
          <p className="text-terra text-xs tracking-[0.3em] uppercase mb-3">Ваш промокод</p>
          <div className="text-center mb-4 text-4xl font-bold tracking-widest text-terra">{code}</div>
          {qr && <img src={qr} alt="QR промокода" className="w-40 h-40 mx-auto mb-4 rounded-xl bg-white p-2" />}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={saveImage} className="btn-terra rounded-full">Сохранить картинкой</button>
            <button onClick={copy} className="btn-outline rounded-full">Скопировать</button>
          </div>
          <button onClick={openPreview} className="w-full mt-3 text-xs text-graphite/60 underline">Не сохраняется? Открыть картинку для сохранения вручную</button>
          <p className="text-xs text-graphite/60 mt-4">Одноразовый, без срока, во всех ресторанах сети. Не суммируется с акциями и банкетами.</p>
        </>)}
      </div>
      {preview && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex flex-col items-center justify-center p-6" onClick={() => setPreview('')}>
          <img src={preview} alt="Промокод" className="max-h-[70vh] rounded-2xl shadow-2xl" />
          <p className="text-cream text-sm text-center mt-4">Зажми палец на картинке → «Сохранить в Фото» (iPhone) или «Скачать изображение» (Android)</p>
          <button className="mt-4 text-cream/70 text-xs underline" onClick={() => setPreview('')}>Закрыть</button>
        </div>
      )}
    </div>
  );
}
