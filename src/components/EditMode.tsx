import { useEffect } from 'react';
export default function EditMode() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('edit') !== '1') return;
    document.body.classList.add('edit-mode');
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest ? ((e.target as HTMLElement).closest('[data-e]') as HTMLElement | null) : null;
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      const kind = t.getAttribute('data-kind') || 'text';
      window.parent.postMessage({
        type: 'iv-edit',
        path: t.getAttribute('data-e') || '',
        kind,
        value: kind === 'image' ? (t.getAttribute('src') || '') : (t.textContent || '').trim(),
      }, '*');
    };
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('click', onClick, true); document.body.classList.remove('edit-mode'); };
  }, []);
  return null;
}
