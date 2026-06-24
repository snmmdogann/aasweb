'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  FileText,
  Presentation,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { Publication, PublicationType } from '@/data/publications';
import { cn } from '@/lib/utils';
import { PublicationItem } from './PublicationItem';

const INITIAL_COUNT = 4;

const iconByType: Record<PublicationType, LucideIcon> = {
  makale: FileText,
  bildiri: Presentation,
  kitap: BookOpen,
};

const accentByType: Record<PublicationType, string> = {
  makale: 'bg-primary text-white',
  bildiri: 'bg-primary-light text-primary-dark',
  kitap: 'bg-primary-dark text-white',
};

/**
 * Bir yayın türünü (Makaleler / Bildiriler / Kitaplar) açılır-kapanır (dropdown)
 * kart olarak gösterir. Karta gelince (hover) ya da başlığa tıklayınca açılır;
 * açıldığında birkaç yayın görünür, "Daha fazla" ile o türün tamamına erişilir.
 */
export function PublicationDropdown({
  tur,
  label,
  items,
}: {
  tur: PublicationType;
  label: string;
  items: Publication[];
}) {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const Icon = iconByType[tur];
  const visible = showAll ? items : items.slice(0, INITIAL_COUNT);
  const remaining = items.length - INITIAL_COUNT;

  return (
    <section
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="h-fit overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_20px_45px_-22px_rgba(41,54,129,0.4)]"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <span
          className={cn(
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
            accentByType[tur],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-primary-dark">{label}</span>
          <span className="block text-sm text-ink/50">{items.length} yayın</span>
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-primary transition-transform duration-300',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink/10 p-4">
              <ul className="flex flex-col gap-3">
                {visible.map((publication, index) => (
                  <PublicationItem
                    key={publication.id}
                    publication={publication}
                    index={index}
                  />
                ))}
              </ul>

              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {showAll ? 'Daha az göster' : `Daha fazla (+${remaining})`}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      showAll && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
