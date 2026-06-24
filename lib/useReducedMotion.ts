'use client';

import { useEffect, useState } from 'react';

/**
 * Kullanıcının "hareketi azalt" (prefers-reduced-motion) tercihini merkezi olarak
 * okur. Tüm animasyonlu bileşenler bu hook üzerinden tutarlı davranır.
 *
 * @returns Tercih aktifse true (animasyonlar kapatılmalı)
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setReduced(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
