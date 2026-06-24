'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

// easeOutExpo — sonlara doğru yavaşlayan yumuşak sayım eğrisi.
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * 0'dan hedef değere belirtilen sürede sayar. Yalnızca `active` true olduğunda başlar
 * (genelde useInViewOnce ile birlikte kullanılır). prefers-reduced-motion açıksa
 * doğrudan hedef değeri döndürür.
 *
 * @param target Hedef sayı
 * @param active Sayımı başlat
 * @param duration Süre (ms)
 */
export function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutExpo(progress) * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, reduced]);

  return value;
}
