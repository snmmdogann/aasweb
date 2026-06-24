'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { press, type PressItem } from '@/data/press';
import { cn, hoverCardClass } from '@/lib/utils';
import { VideoEmbed } from './VideoEmbed';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ISO tarihi okunur TR formatına çevir.
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function PressCard({ entry }: { entry: PressItem }) {
  if (entry.tip === 'video' && entry.videoEmbedUrl) {
    return (
      <motion.div
        variants={item}
        className="mb-6 break-inside-avoid rounded-xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur-sm"
      >
        <VideoEmbed src={entry.videoEmbedUrl} title={entry.baslik} />
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {entry.kaynakAdi} · {formatDate(entry.tarih)}
          </p>
          <h3 className="mt-1 font-semibold text-white">{entry.baslik}</h3>
        </div>
      </motion.div>
    );
  }

  // Haber kartı — tıklanınca haberUrl'e yeni sekmede gider.
  return (
    <motion.a
      href={entry.haberUrl ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      variants={item}
      className={cn(
        'mb-6 flex break-inside-avoid flex-col rounded-xl border border-white/10 bg-white/10 p-5 shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        hoverCardClass,
      )}
    >
      {/* [DÜZENLE] - gerçek kaynak logosu gelince next/image ile değiştirilecek. */}
      <div className="flex h-14 w-32 items-center justify-center rounded-md bg-white/10 text-center text-sm font-semibold text-white/50">
        {entry.kaynakAdi}
      </div>
      <p className="mt-4 text-xs font-medium text-white/50">
        {formatDate(entry.tarih)}
      </p>
      <h3 className="mt-1 font-semibold text-white">{entry.baslik}</h3>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Habere Git
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </span>
    </motion.a>
  );
}

/**
 * Basın kayıtlarının masonry düzeninde (CSS columns) gösterimi.
 * Video kayıtları gömülü iframe, haber kayıtları tıklanabilir kart olarak render edilir.
 * Grid'e scroll ile girerken kartlar stagger fade-in-up.
 */
export function PressMasonryGrid() {
  return (
    <motion.div
      className="columns-1 gap-6 md:columns-2 lg:columns-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {press.map((entry) => (
        <PressCard key={entry.id} entry={entry} />
      ))}
    </motion.div>
  );
}
