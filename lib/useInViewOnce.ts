'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Bir elemanın viewport'a ilk kez girdiğini tek seferlik (once) algılar.
 * IntersectionObserver tabanlı — scroll ile tetiklenen animasyonlar için kullanılır.
 *
 * @returns ref (gözlemlenecek elemana bağlanır) ve inView (görünür olduysa true)
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.2,
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}
