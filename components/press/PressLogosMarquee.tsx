'use client';

import { press } from '@/data/press';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Basında yer alınan kaynakların tekilleştirilmiş listesi.
const sources = Array.from(new Set(press.map((item) => item.kaynakAdi)));

// [DÜZENLE] - gerçek logolar gelince bu gri kutular next/image ile değiştirilecek.
function LogoBox({ name }: { name: string }) {
  return (
    <div className="flex h-16 w-40 shrink-0 items-center justify-center rounded-lg bg-ink/5 px-4 text-center text-sm font-semibold text-ink/50">
      {name}
    </div>
  );
}

/**
 * Basın kaynaklarının logolarını sonsuz kayan şerit halinde gösterir.
 * Üzerine gelince şerit durur. prefers-reduced-motion açıksa statik grid'e düşer.
 */
export function PressLogosMarquee() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {sources.map((name) => (
          <LogoBox key={name} name={name} />
        ))}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden">
      {/* Kenarlarda yumuşak geçiş için maske. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

      <div
        className={cn(
          'flex w-max gap-6',
          'animate-marquee group-hover:[animation-play-state:paused]',
        )}
      >
        {/* Kesintisiz döngü için liste iki kez render edilir. */}
        {[...sources, ...sources].map((name, index) => (
          <LogoBox key={`${name}-${index}`} name={name} />
        ))}
      </div>
    </div>
  );
}
