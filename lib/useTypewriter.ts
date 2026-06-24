'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TypewriterOptions {
  /** Karakter yazma hızı (ms) */
  typeSpeed?: number;
  /** Karakter silme hızı (ms) */
  deleteSpeed?: number;
  /** Kelime tamamlandığında bekleme süresi (ms) */
  pause?: number;
}

/**
 * Verilen kelime dizisini sırayla yazıp silen daktilo (typewriter) efekti.
 * prefers-reduced-motion açıksa animasyon yapmadan ilk kelimeyi sabit döndürür.
 *
 * @param words Döngüyle yazılacak ifadeler
 */
export function useTypewriter(
  words: readonly string[],
  { typeSpeed = 80, deleteSpeed = 40, pause = 2000 }: TypewriterOptions = {},
) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || words.length === 0) return;

    const current = words[wordIndex % words.length];

    // Kelime tamamlandı → bir süre bekle, sonra silmeye başla.
    if (!deleting && text === current) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }

    // Silme bitti → sıradaki kelimeye geç.
    if (deleting && text === '') {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        );
      },
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, reduced, words, typeSpeed, deleteSpeed, pause]);

  if (reduced) return words[0] ?? '';
  return text;
}
