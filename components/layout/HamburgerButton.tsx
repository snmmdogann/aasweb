'use client';

import { motion } from 'framer-motion';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Sol üstte sabit duran, 3 çizgiden X'e dönüşen animasyonlu menü düğmesi.
 * Off-canvas menünün açılıp kapanmasını tetikler.
 */
export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
      aria-expanded={isOpen}
      aria-controls="off-canvas-menu"
      className="fixed left-5 top-5 z-[60] flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <span className="relative block h-4 w-6" aria-hidden="true">
        <motion.span
          className="absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-primary-dark"
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 rounded-full bg-primary-dark"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute bottom-0 left-0 block h-0.5 w-6 rounded-full bg-primary-dark"
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </span>
    </button>
  );
}
