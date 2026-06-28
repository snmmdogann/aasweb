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
        loading="lazy"
        decoding="async"
        className="h-full w-auto max-w-none object-cover"
      />
    </div>
  );
}

/**
 * Tek sıra: liste iki kez render edilir, animasyon -%50 kaydırdığı için
 * kesintisiz (sonsuz) döngü oluşur. Üzerine gelince durur.
 */
function MarqueeRow({
  images,
  reverse = false,
}: {
  images: MarqueeImage[];
  reverse?: boolean;
}) {
  return (
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
  );
}

/**
 * Basın görsellerini iki sıra halinde, zıt yönlerde SÜREKLİ kayan bir bant olarak
 * gösterir. Animasyon GPU dostu CSS transform (translate3d) ile yapıldığından
 * mobilde kasmaz. prefers-reduced-motion açıksa görseller statik ızgara olarak
 * (boş kalmadan) gösterilir.
 */
export function PressMarquee({ images }: { images: MarqueeImage[] }) {
  const reduced = useReducedMotion();

  if (images.length === 0) return null;

  // İki sıraya bölerek daha dolu bir görünüm elde et; tek görsel varsa ikisinde de göster.
  const mid = Math.ceil(images.length / 2);
  const rowTop = images.slice(0, mid);
  const rowBottom = images.slice(mid).length > 0 ? images.slice(mid) : rowTop;

  if (reduced) {
    return (
      <div className="flex flex-wrap justify-center gap-5">
        {images.map((image) => (
          <MarqueeImageItem key={image.id} image={image} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-5 overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]',
      )}
    >
      <MarqueeRow images={rowTop} />
      <MarqueeRow images={rowBottom} reverse />
    </div>
  );
}
