'use client';

import { pressImages, type PressImage } from '@/data/press';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/useReducedMotion';

// Tek görsel — sabit yükseklik, doğal genişlik (kırpılmadan tam görünür).
function MarqueeImage({ image }: { image: PressImage }) {
  return (
    <div className="h-40 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-lg md:h-48">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt=""
        aria-hidden="true"
        className="h-full w-auto max-w-none object-cover"
      />
    </div>
  );
}

// Tek sıra: liste iki kez render edilerek kesintisiz döngü sağlanır.
function MarqueeRow({
  images,
  reverse = false,
}: {
  images: PressImage[];
  reverse?: boolean;
}) {
  return (
    <div className="flex w-max gap-5">
      <div
        className={cn(
          'flex w-max gap-5',
          'animate-marquee group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {[...images, ...images].map((image, index) => (
          <MarqueeImage key={`${image.id}-${index}`} image={image} />
        ))}
      </div>
    </div>
  );
}

/**
 * Basın görsellerini iki sıra halinde, zıt yönlerde kayan bir bant olarak gösterir.
 * Yazı/bağlantı yoktur — yalnızca görseller. Üzerine gelince durur.
 * prefers-reduced-motion açıksa statik bir şerit olarak kalır.
 */
export function PressMarquee() {
  const reduced = useReducedMotion();

  // Görselleri iki sıraya bölerek daha dolu bir görünüm elde et.
  const mid = Math.ceil(pressImages.length / 2);
  const rowTop = pressImages.slice(0, mid);
  const rowBottom = pressImages.slice(mid);

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-5 overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]',
      )}
    >
      {reduced ? (
        <div className="flex w-max gap-5">
          {pressImages.map((image) => (
            <MarqueeImage key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <>
          <MarqueeRow images={rowTop} />
          <MarqueeRow images={rowBottom} reverse />
        </>
      )}
    </div>
  );
}
