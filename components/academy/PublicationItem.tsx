'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Publication } from '@/data/publications';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Kompakt yayın kartı (dropdown içinde kullanılır). Açıldığında sırayla (stagger)
 * belirir. Yalnızca DOI'si olan yayınlarda "İncele" bağlantısı gösterilir.
 */
export function PublicationItem({
  publication,
  index = 0,
}: {
  publication: Publication;
  index?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
        delay: Math.min(index, 12) * 0.04,
      }}
      className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10"
    >
      <p className="text-sm font-medium leading-snug text-white">
        {publication.baslik}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/55">
        {publication.yazarlar}
      </p>
      <p className="mt-0.5 text-xs text-white/45">
        {publication.dergiVeyaKonferans} · {publication.yil}
      </p>

      {publication.doiUrl && (
        <a
          href={publication.doiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-primary/30 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          İncele
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </motion.li>
  );
}
