'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Route değişimlerinde içeriği kısa bir fade + 8px translateY ile yumuşakça getirir.
 * app/template.tsx üzerinden uygulanır (Next.js her gezinmede template'i yeniden mount eder).
 * prefers-reduced-motion açıksa animasyon uygulanmaz.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
