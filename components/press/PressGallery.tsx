'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

export interface PublicPressItem {
  id: string;
  tur: 'medya' | 'haber';
  baslik: string | null;
  aciklama: string | null;
  imageUrl: string;
  haberUrl: string | null;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function PressGallery({ items }: { items: PublicPressItem[] }) {
  const mediaItems = useMemo(() => items.filter((i) => i.tur === 'medya'), [items]);

  // Aktif öğe: hem medya hem haber için aynı panel
  const [activeItem, setActiveItem] = useState<PublicPressItem | null>(null);

  const activeMediaIndex = useMemo(
    () => (activeItem?.tur === 'medya' ? mediaItems.findIndex((m) => m.id === activeItem.id) : -1),
    [activeItem, mediaItems],
  );

  const close = useCallback(() => setActiveItem(null), []);

  const next = useCallback(() => {
    if (activeMediaIndex < 0) return;
    setActiveItem(mediaItems[(activeMediaIndex + 1) % mediaItems.length]);
  }, [activeMediaIndex, mediaItems]);

  const prev = useCallback(() => {
    if (activeMediaIndex < 0) return;
    setActiveItem(mediaItems[(activeMediaIndex - 1 + mediaItems.length) % mediaItems.length]);
  }, [activeMediaIndex, mediaItems]);

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' && activeItem.tur === 'medya') next();
      else if (e.key === 'ArrowLeft' && activeItem.tur === 'medya') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeItem, close, next, prev]);

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
              <motion.button
                key={it.id}
                type="button"
                variants={cardAnim}
                onClick={() => setActiveItem(it)}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(24,47,87,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                {it.baslik && (
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-medium text-white/90">
                      {it.baslik}
                    </p>
                  </div>
                )}
              </motion.button>
            );
          }

          // Medya öğesi → lightbox açar
          return (
            <motion.button
              key={it.id}
              type="button"
              variants={cardAnim}
              onClick={() => setActiveItem(it)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(24,47,87,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.imageUrl}
                alt={it.baslik ?? 'Basın görseli'}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {it.baslik && (
                <div className="border-t border-white/5 px-4 py-2.5 text-left">
                  <p className="line-clamp-1 text-sm text-white/70">{it.baslik}</p>
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Birleşik lightbox — medya ve haber için */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            {/* Kapat */}
            <button
              type="button"
              onClick={close}
              aria-label="Kapat"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Medya gezinme okları */}
            {activeItem.tur === 'medya' && mediaItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Önceki"
                  className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:left-6"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Sonraki"
                  className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-6"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            {/* İçerik: görsel + başlık + açıklama */}
            <div
              className="flex max-h-[90vh] w-full max-w-3xl flex-col items-center overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={activeItem.id}
                src={activeItem.imageUrl}
                alt={activeItem.baslik ?? 'Basın görseli'}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />

              {(activeItem.baslik || activeItem.aciklama || (activeItem.tur === 'haber' && activeItem.haberUrl)) && (
                <div className="mt-5 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-5 text-center backdrop-blur-sm">
                  {activeItem.tur === 'haber' && (
                    <span className="mb-3 inline-block rounded-full bg-red-500/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-red-400">
                      Haber
                    </span>
                  )}
                  {activeItem.baslik && (
                    <p className="text-base font-semibold text-white">
                      {activeItem.baslik}
                    </p>
                  )}
                  {activeItem.aciklama && (
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {activeItem.aciklama}
                    </p>
                  )}
                  {activeItem.tur === 'haber' && activeItem.haberUrl && (
                    <a
                      href={activeItem.haberUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                    >
                      Habere Git <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
