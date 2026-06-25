'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Anasayfa' },
  { href: '/hakkimda', label: 'Hakkımda' },
  { href: '/akademi', label: 'Akademi' },
  { href: '/basinda-biz', label: 'Basın' },
  { href: '/iletisim', label: 'İletişim' },
] as const;

interface OffCanvasMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sol üst köşeden dairesel clipPath animasyonuyla açılan tam ekran menü.
 * - Arka plana backdrop-blur + koyu overlay uygular (tıklayınca kapanır).
 * - ESC ile kapanır, açıkken Tab odağı panel içinde tutulur (focus-trap).
 * - Açıkken sayfa kaydırması kilitlenir.
 */
export function OffCanvasMenu({ isOpen, onClose }: OffCanvasMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab' && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.nav
            id="off-canvas-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
            className="fixed left-0 top-0 z-50 bg-primary-dark text-white"
            style={{
              width: 'min(480px, 90vw)',
              height: 'min(480px, 90vh)',
              borderBottomRightRadius: '100%',
            }}
            initial={{ clipPath: 'circle(0% at 0% 0%)', opacity: 0 }}
            animate={{ clipPath: 'circle(141% at 0% 0%)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at 0% 0%)', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.55 }}
          >
            <ul className="absolute inset-0 h-full w-full">
              {navLinks.map((link, index) => {
                const active = pathname === link.href;
                // Çeyrek daire (quarter circle) kavisini takip etmesi için açı hesaplaması
                const angleDeg = 15 + index * 15; // 15, 30, 45, 60, 75 derece
                const angleRad = angleDeg * (Math.PI / 180);
                const radius = 58; // % cinsinden yarıçap
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.li
                    key={link.href}
                    className="absolute"
                    style={{
                      left: `calc(40px + ${x}%)`, // Hamburger menü butonunun konumuna göre offset
                      top: `calc(40px + ${y}%)`,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.15 + index * 0.05,
                      duration: 0.35,
                      ease: 'easeOut',
                    }}
                  >
                    <div className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                      <Link
                        href={link.href}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative inline-block py-2 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark',
                          active ? 'text-primary-light' : 'text-white/90 hover:text-white',
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            'absolute -bottom-0.5 left-0 h-0.5 bg-primary-light transition-all duration-300',
                            active ? 'w-full' : 'w-0 group-hover:w-full',
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
