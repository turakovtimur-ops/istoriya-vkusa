import { useState } from 'react';

interface Props {
  src?: string;
  alt: string;
  fallback: string;
  color: string;
  className?: string;
  fit?: 'contain' | 'cover';
}

// Показывает логотип; если файла нет — имя бренда фирменным цветом
export default function BrandImg({ src, alt, fallback, color, className, fit = 'contain' }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={'flex items-center justify-center text-center ' + (className || '')}>
        <span className="font-semibold text-lg leading-tight" style={{ color: color }}>{fallback}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      style={{ objectFit: fit }}
    />
  );
}