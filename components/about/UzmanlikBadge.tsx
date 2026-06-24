'use client';

import { motion } from 'framer-motion';
import { expertiseAreas } from '@/data/about';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Uzmanlık alanları — pill (rozet) biçiminde, flex-wrap dizilim.
 * Sayfaya girerken stagger ile belirir; hover'da primary dolguya yumuşak geçiş.
 */
export function UzmanlikBadge() {
  return (
    <motion.div
      className="mx-auto flex max-w-3xl flex-wrap gap-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {expertiseAreas.map((area) => (
        <motion.span
          key={area}
          variants={item}
          className="cursor-default rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary-dark transition-colors duration-300 hover:bg-primary hover:text-white"
        >
          {area}
        </motion.span>
      ))}
    </motion.div>
  );
}
