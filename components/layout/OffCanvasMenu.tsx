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
  { href: '/basinda-biz', label: 'Basın ve Medya' },
  { href: '/iletisim', label: 'İletişim' },
] as const;

interface OffCanvasMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sol üst köşeden dairesel clipPath animasyonuyla açılan tam ekran menü.
 * Menü öğeleri çeyrek daire yayı boyunca simetrik olarak dağıtılır.
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

  // Çeyrek daire boyutu (px cinsinden)
  const SIZE = 420;
  // Yay yarıçapı — öğeler bu yarıçaptaki yay üzerine yerleşir
  const RADIUS = SIZE * 0.55;
  // Öğelerin yay üzerindeki açı aralığı (derece). 
  // Koordinat sistemi: sol-üst köşe merkez, 0° = aşağı, 90° = sağ.
  // İlk öğe (Anasayfa) sağ-üst tarafta (büyük açı), son öğe (İletişim) sol-alt tarafta (küçük açı).
  const START_ANGLE = 15;
  const END_ANGLE = 75;
  const ANGLE_STEP = (END_ANGLE - START_ANGLE) / (navLinks.length - 1);

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
            className="fixed left-0 top-0 z-50 overflow-hidden text-white"
            style={{
              width: `min(${SIZE}px, 88vw)`,
              height: `min(${SIZE}px, 80vh)`,
              borderBottomRightRadius: '100%',
            }}
            initial={{ clipPath: 'circle(0% at 0% 0%)', opacity: 0 }}
            animate={{ clipPath: 'circle(141% at 0% 0%)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at 0% 0%)', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.55 }}
          >
            {/* Gradient arka plan */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 0% 0%, rgba(27, 70, 97, 0.95) 0%, rgba(24, 47, 87, 0.98) 50%, rgba(24, 47, 87, 1) 100%)
                `,
              }}
            />

            {/* Dekoratif yörünge halkaları */}
            {[0.35, 0.55, 0.75, 0.95].map((scale, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute rounded-full border border-white/[0.04]"
                style={{
                  width: SIZE * scale * 2,
                  height: SIZE * scale * 2,
                  left: -SIZE * scale,
                  top: -SIZE * scale,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
              />
            ))}

            {/* İnce parlayan yay çizgisi — öğelerin hizasında */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: RADIUS * 2,
                height: RADIUS * 2,
                left: -RADIUS,
                top: -RADIUS,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.03)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />

            {/* Menü öğeleri — köşegen boyunca eşit aralıklı dağılım */}
            <ul className="absolute inset-0 h-full w-full">
              {navLinks.map((link, index) => {
                const active = pathname === link.href;

                // Kullanıcının tam isteği:
                // 1. Basın ve Medya, İletişim'e doğru BİRAZ daha yaklaştırıldı (y=195'ten y=200'e çekildi).
                // 2. İletişim dip noktada (y=228) sabit bırakıldı.
                // 3. Aralarındaki boşluk tam kararında (28px) ayarlandı.
                const customY = [65, 115, 160, 200, 228];
                const cy = customY[index] || 0;

                // Çember denklemi: x^2 + y^2 = R^2 => x = sqrt(R^2 - y^2)
                const R = RADIUS - 0.5;
                const cx = Math.sqrt(Math.max(0, R * R - cy * cy));

                const dotWidth = active ? 8 : 5;

                return (
                  <motion.li
                    key={link.href}
                    className="absolute flex items-center"
                    style={{
                      // Sol kenarı, noktanın genişliğinin yarısı kadar geriye çekerek noktanın merkezini tam cx konumuna alıyoruz.
                      left: cx - (dotWidth / 2),
                      top: cy,
                    }}
                    // Framer Motion, style içindeki transform'u ezdiği için translateY(-50%) işlemini 'y' prop'u ile yapmalıyız.
                    initial={{ opacity: 0, scale: 0.3, filter: 'blur(8px)', y: '-50%' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: '-50%' }}
                    exit={{ opacity: 0, scale: 0.3, filter: 'blur(8px)', y: '-50%' }}
                    transition={{
                      delay: 0.18 + index * 0.06,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Parlayan nokta göstergesi — tam yay üzerinde */}
                    <motion.span
                      className="mr-3 flex-shrink-0 rounded-full"
                      style={{
                        width: active ? 8 : 5,
                        height: active ? 8 : 5,
                        backgroundColor: active
                          ? 'rgba(255, 255, 255, 0.9)'
                          : 'rgba(255, 255, 255, 0.35)',
                        boxShadow: active
                          ? '0 0 12px rgba(255, 255, 255, 0.8), 0 0 24px rgba(255, 255, 255, 0.4)'
                          : '0 0 6px rgba(255, 255, 255, 0.15)',
                      }}
                      animate={
                        active
                          ? {
                            boxShadow: [
                              '0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.4)',
                              '0 0 18px rgba(255,255,255,1), 0 0 36px rgba(255,255,255,0.6)',
                              '0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.4)',
                            ],
                          }
                          : {}
                      }
                      transition={
                        active
                          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                          : {}
                      }
                    />

                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative inline-block whitespace-nowrap py-1.5 text-[18px] font-semibold tracking-wide transition-all duration-300',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark',
                        active
                          ? 'text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]'
                          : 'text-white/70 hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]',
                      )}
                    >
                      <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block">
                        {link.label}
                      </span>

                      {/* Alt çizgi animasyonu */}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-white/90 to-white/40 transition-all duration-400',
                          active ? 'w-full' : 'w-0 group-hover:w-full',
                        )}
                        style={{
                          boxShadow: active
                            ? '0 0 8px rgba(255, 255, 255, 0.6)'
                            : 'none',
                        }}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Sol-alt köşede hafif dekoratif parlaklık */}
            <motion.div
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(27, 97, 86, 0.3) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

