import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind sınıflarını koşullu olarak birleştirir ve çakışmaları çözer.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Tüm tıklanabilir kartlarda tutarlı hover efekti (FAZ 2'de detaylandırılacak).
// [DÜZENLE/GENİŞLET] - faz ilerledikçe ortak kart davranışı buraya toplanacak.
export const hoverCardClass =
  'transition-all duration-300 ease-out hover:-translate-y-1 ' +
  'hover:shadow-[0_20px_40px_-15px_rgba(66,116,217,0.35)]';
