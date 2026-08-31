export function merge<T>(base: T, over: any): T {
  const b: any = base;
  if (over === undefined || over === null) return base;
  if (Array.isArray(over)) return over as unknown as T;
  if (typeof over === 'object' && typeof b === 'object' && b && !Array.isArray(b)) {
    const out: any = { ...b };
    for (const k of Object.keys(over)) out[k] = merge(b[k], over[k]);
    return out as T;
  }
  return over as T;
}
