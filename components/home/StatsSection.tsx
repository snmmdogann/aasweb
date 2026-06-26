'use client';

import { motion } from 'framer-motion';
import type { Stat } from '@/data/stats';
import { StatCard } from './StatCard';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

/**
 * İstatistikler bölümü. Arka planda çok silik, dekoratif bir Türkiye silüeti;
 * önünde stats.ts'ten beslenen, scroll'a girince stagger ile beliren kartlar.
 */
export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative overflow-hidden bg-ice/10 py-20">
      {/* Dekoratif arka plan silüeti (çok silik). Yavaşça nefes alma animasyonu var */}
      <motion.svg
        className="pointer-events-none absolute left-1/2 top-1/2 w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 text-primary-dark"
        viewBox="0 0 800 320"
        fill="currentColor"
        aria-hidden="true"
        animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M60 170 C90 150 130 160 165 150 C200 140 230 120 270 125 C300 128 320 145 355 140 C395 135 420 110 465 115 C505 120 530 145 575 145 C615 145 650 125 695 135 C725 142 745 165 740 190 C735 215 700 220 670 215 C640 210 615 195 585 200 C550 206 530 230 490 228 C455 226 435 205 400 208 C365 211 345 235 305 232 C270 229 250 208 215 210 C180 212 160 232 125 226 C95 221 70 205 60 185 Z" />
      </motion.svg>

      <div className="relative mx-auto w-full max-w-5xl px-6">
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
