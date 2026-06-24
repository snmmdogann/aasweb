'use client';

import { motion } from 'framer-motion';
import type { Stat } from '@/data/stats';
import { useCountUp } from '@/lib/useCountUp';
import { useInViewOnce } from '@/lib/useInViewOnce';

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Tek bir istatistik kartı. Hafif yatay eğimli (skew) görünür; içerik ters skew
 * ile düz tutulur. Viewport'a girince sayı 0'dan hedefe doğru sayar.
 */
export function StatCard({ stat }: { stat: Stat }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const value = useCountUp(stat.value, inView);

  return (
    // Dış sarmalayıcı: framer-motion giriş animasyonunu taşır (transform skew ile çakışmasın).
    <motion.div ref={ref} variants={item}>
      <div className="-skew-x-6 rounded-xl bg-primary px-8 py-10 text-white shadow-lg">
        <div className="flex skew-x-6 flex-col items-center text-center">
          <span className="text-4xl font-bold sm:text-5xl">
            {value}
            {stat.suffix}
          </span>
          <span className="mt-2 text-sm font-medium text-white/90 sm:text-base">
            {stat.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
