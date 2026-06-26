'use client';

import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/useReducedMotion';

export interface MarqueeImage {
  id: string;
  src: string;
}

// Tek görsel — sabit yükseklik, doğal genişlik (kırpılmadan tam görünür).
function MarqueeImageItem({ image }: { image: MarqueeImage }) {
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
  images: MarqueeImage[];
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
          <MarqueeImageItem key={`${image.id}-${index}`} image={image} />
        ))}
      </div>
    </div>
  );
}

/**
 * Basın görsellerini iki sıra halinde, zıt yönlerde kayan bir bant olarak gösterir.
 * Yazı/bağlantı yoktur — yalnızca görseller. Üzerine gelince durur.
 * prefers-reduced-motion açıksa statik bir şerit olarak kalır.
 * Görseller veritabanından (medya öğeleri) prop olarak alınır.
 */
export function PressMarquee({ images }: { images: MarqueeImage[] }) {
  const reduced = useReducedMotion();

  if (images.length === 0) return null;

  // Görselleri iki sıraya bölerek daha dolu bir görünüm elde et.
  const mid = Math.ceil(images.length / 2);
  const rowTop = images.slice(0, mid);
  const rowBottom = images.slice(mid);

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-5 overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]',
      )}
    >
      {reduced ? (
        <div className="flex w-max gap-5">
          {images.map((image) => (
            <MarqueeImageItem key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <>
          <MarqueeRow images={rowTop} />
          <MarqueeRow images={rowBottom.length > 0 ? rowBottom : rowTop} reverse />
        </>
      )}
    </div>
  );
}
