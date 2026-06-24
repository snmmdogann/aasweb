'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/data/site-config';

/**
 * Sayfa altında tam genişlikte (full-bleed), primary-dark arka planlı Verkosis bandı.
 * Viewport'a girince ağırbaşlı bir fade-in ile belirir.
 */
export function VerkosisBanner() {
  return (
    <motion.section
      className="bg-primary-dark px-6 py-16 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <p className="text-lg leading-relaxed sm:text-xl">
          Sektörel siber güvenlik çözümleri, kaynak kod analizleri ve sızma
          testleri için Verkosis&apos;i ziyaret edebilirsiniz.
        </p>
        <a
          href={siteConfig.verkosisUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-lg font-semibold text-primary-light transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
        >
          verkosis.com
          <ArrowRight
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </motion.section>
  );
}
