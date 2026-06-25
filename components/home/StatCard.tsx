'use client';

import { motion } from 'framer-motion';
import type { Stat } from '@/data/stats';
import { useCountUp } from '@/lib/useCountUp';
import { useInViewOnce } from '@/lib/useInViewOnce';

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

/**
 * Tek bir istatistik kartı. Viewport'a girince sayı 0'dan hedefe doğru sayar.
 * Sürekli yavaşça havada süzülme (float) animasyonuna sahiptir.
 */
export function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const value = useCountUp(stat.value, inView);

  return (
    // Dış sarmalayıcı: giriş animasyonu
    <motion.div ref={ref} variants={item}>
      {/* İç sarmalayıcı: sürekli süzülme animasyonu */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        className="group"
      >
        <div className="-skew-x-6 rounded-xl bg-primary px-8 py-10 text-white shadow-lg transition-all duration-300 group-hover:bg-primary-dark group-hover:shadow-[0_20px_40px_-15px_rgba(27,70,97,0.7)]">
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
    </motion.div>
  );
}
