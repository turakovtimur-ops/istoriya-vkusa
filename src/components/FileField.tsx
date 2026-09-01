interface Props {
  label: string;
  accept: string;
  required?: boolean;
  fileName: string;
  onFile: (name: string, file?: File) => void;
  hint?: string;
}
export default function FileField({ label, accept, required, fileName, onFile, hint }: Props) {
  return (
    <label className="block cursor-pointer">
      <span className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">
        {label}{required ? ' *' : ''}
      </span>
      <span className="flex items-center gap-3 border border-dashed border-graphite/40 px-4 py-3.5 hover:border-terra transition-colors bg-white/40">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-terra flex-none">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
        <span className={'text-sm truncate ' + (fileName ? 'text-graphite' : 'text-muted')}>
          {fileName || (hint ? hint : 'Нажмите, чтобы прикрепить файл')}
        </span>
        <input
          type="file"
          accept={accept}
          required={required}
          className="hidden"
          onChange={(e) => { const f = e.target.files && e.target.files[0]; onFile(f ? f.name : '', f || undefined); }}
        />
      </span>
    </label>
  );
}
