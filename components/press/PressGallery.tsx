'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

export interface PublicPressItem {
  id: string;
  tur: 'medya' | 'haber';
  baslik: string | null;
  imageUrl: string;
  haberUrl: string | null;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Basın içeriklerinin masonry (CSS columns) galerisi. İki tür öğe destekler:
 *  - "medya": tıklanınca tam ekran lightbox açan görsel (ok tuşları / ESC ile gezinme).
 *  - "haber": kapak görseli + "HABER" rozeti olan, tıklanınca haberUrl'i yeni
 *    sekmede açan ayırt edici kart.
 */
export function PressGallery({ items }: { items: PublicPressItem[] }) {
  // Lightbox yalnızca medya görsellerinde gezinir.
  const mediaItems = useMemo(
    () => items.filter((i) => i.tur === 'medya'),
    [items],
  );

  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const isOpen = activeMediaIndex !== null;

  const close = useCallback(() => setActiveMediaIndex(null), []);
  const next = useCallback(
    () =>
      setActiveMediaIndex((i) =>
        i === null ? i : (i + 1) % mediaItems.length,
      ),
    [mediaItems.length],
  );
  const prev = useCallback(
    () =>
      setActiveMediaIndex((i) =>
        i === null ? i : (i - 1 + mediaItems.length) % mediaItems.length,
      ),
    [mediaItems.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close, next, prev]);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/50">
        Henüz içerik eklenmedi.
      </p>
    );
  }

  return (
    <>
      <motion.div
        className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
      >
        {items.map((it) => {
          if (it.tur === 'haber') {
            return (
              <motion.a
                key={it.id}
                href={it.haberUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                variants={item}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(24,47,87,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  Haber
                </span>
                {it.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.imageUrl}
                    alt={it.baslik ?? 'Haber'}
                    loading="lazy"
                    className="w-full transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary-dark to-primary text-white/40">
                    <ExternalLink className="h-8 w-8" />
                  </div>
                )}
                {/* Hover overlay + başlık */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Habere Git <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </div>
                {it.baslik && (
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-medium text-white/90">
                      {it.baslik}
                    </p>
                  </div>
                )}
              </motion.a>
            );
          }

          // Medya öğesi → lightbox açar.
          const mediaIndex = mediaItems.findIndex((m) => m.id === it.id);
          return (
            <motion.button
              key={it.id}
              type="button"
              variants={item}
              onClick={() => setActiveMediaIndex(mediaIndex)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(24,47,87,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.imageUrl}
                alt={it.baslik ?? 'Basın görseli'}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Lightbox (yalnızca medya) */}
      <AnimatePresence>
        {isOpen && activeMediaIndex !== null && mediaItems[activeMediaIndex] && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Kapat"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-6 w-6" />
            </button>

            {mediaItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Önceki"
                  className="absolute left-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:left-6"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Sonraki"
                  className="absolute right-2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-6"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <motion.img
              key={activeMediaIndex}
              src={mediaItems[activeMediaIndex].imageUrl}
              alt={mediaItems[activeMediaIndex].baslik ?? 'Basın görseli'}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
