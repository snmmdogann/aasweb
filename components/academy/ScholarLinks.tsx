'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { cn, hoverCardClass } from '@/lib/utils';

const links = [
  {
    label: 'Google Scholar',
    href: siteConfig.social.scholar,
    Icon: GraduationCap,
  },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Akademi sayfası üstündeki akademik profil linkleri (Google Scholar, ResearchGate).
 * Beyaz kart üzerinde primary ikon + isim; hover'da ortak hoverCardClass ile yükselir.
 */
export function ScholarLinks() {
  return (
    <motion.div
      className="flex flex-wrap gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {links.map(({ label, href, Icon }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          variants={item}
          className={cn(
            'flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-5 py-3 shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            hoverCardClass,
          )}
        >
          <Icon className="h-6 w-6 text-white/80" aria-hidden="true" />
          <span className="font-semibold text-white">{label}</span>
        </motion.a>
      ))}
    </motion.div>
  );
}
