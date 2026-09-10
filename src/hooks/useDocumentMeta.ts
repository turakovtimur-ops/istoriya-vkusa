import { useEffect } from 'react';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let m = document.querySelector(`meta[${attr}="${key}"]`);
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute(attr, key);
    document.head.appendChild(m);
  }
  m.setAttribute('content', content);
}

export function useDocumentMeta(title: string, description?: string, image?: string, url?: string) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
    }
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    if (image) setMeta('property', 'og:image', image);
    if (url) setMeta('property', 'og:url', url);
  }, [title, description, image, url]);
}