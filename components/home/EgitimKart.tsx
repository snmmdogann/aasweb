'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Code2,
  Fingerprint,
  FileLock2,
  Network,
  Radar,
  ShieldAlert,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { Training } from '@/data/trainings';
import { cn, hoverCardClass } from '@/lib/utils';

// trainings.ts'teki `icon` string'ini gerçek lucide bileşenine eşle.
const iconMap: Record<string, LucideIcon> = {
  ShieldAlert,
  Code2,
  Fingerprint,
  FileLock2,
  Network,
  BadgeCheck,
  Radar,
  Terminal,
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Tek bir kurumsal eğitim kartı: ikon, başlık, kısa açıklama ve
 * iletişim sayfasına (ön-doldurulmuş konu/eğitim ile) yönlendiren talep butonu.
 */
export function EgitimKart({ training }: { training: Training }) {
  const Icon = iconMap[training.icon] ?? ShieldAlert;

  return (
    <motion.div
      variants={item}
      className={cn(
        'group flex h-full flex-col rounded-xl border border-white/10 bg-white/10 p-6 shadow-sm backdrop-blur-sm',
        hoverCardClass,
      )}
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="text-lg font-semibold text-white">{training.baslik}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
        {training.aciklama}
      </p>

      <Link
        href={`/iletisim?konu=egitim&egitimAdi=${training.slug}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Eğitim Talebi Oluştur
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
