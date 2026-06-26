'use client';

import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Hakkımda sayfasının biyografi bölümü: temiz tipografi ile data/about.ts'ten
 * gelen paragraflar. Sayfa açılışında stagger fade-in-up.
 */
export function BioSection({ paragraphs }: { paragraphs: string[] }) {
  return (
    <motion.div
      className="mx-auto max-w-3xl space-y-5"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {paragraphs.map((paragraph, index) => (
        <motion.p
          key={index}
          variants={item}
          className="text-lg leading-relaxed text-white/90"
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}
