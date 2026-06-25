'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Publication } from '@/data/publications';

const ITEMS_PER_PAGE = 4;

/**
 * Kitap iç sayfası: yayınları sayfalı şekilde gösterir.
 * Sayfa geçişlerinde flip animasyonu uygulanır.
 */
export function BookPage({
  items,
  currentPage,
  direction,
}: {
  items: Publication[];
  currentPage: number;
  direction: number; // 1 = forward, -1 = backward
}) {
  const start = currentPage * ITEMS_PER_PAGE;
  const pageItems = items.slice(start, start + ITEMS_PER_PAGE);

  const variants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      transformOrigin: 'center center',
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
    }),
  };

  return (
    <div className="page-flip-container relative min-h-[280px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="w-full"
          style={{ perspective: '1200px' }}
        >
          <ul className="flex flex-col gap-2.5">
            {pageItems.map((pub, idx) => (
              <motion.li
                key={pub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="rounded-lg border border-white/10 bg-white/5 p-3 transition-colors duration-200 hover:bg-white/10"
              >
                <p className="text-sm font-medium leading-snug text-white">
                  {pub.baslik}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  {pub.yazarlar}
                </p>
                <p className="mt-0.5 text-xs text-white/40">
                  {pub.dergiVeyaKonferans} · {pub.yil}
                </p>
                {pub.doiUrl && (
                  <a
                    href={pub.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 rounded-md border border-primary/30 px-2 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    İncele
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </motion.li>
            ))}
          </ul>

          {/* Sayfa numarası (kitap sayfası hissi) */}
          <div className="mt-3 text-center text-xs text-white/30 italic">
            — {currentPage + 1} —
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { ITEMS_PER_PAGE };
