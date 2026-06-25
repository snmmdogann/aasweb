'use client';

/**
 * Akademi sayfası arka planında süzülen kitap silüetleri.
 * Her kitap farklı boyut, konum, hız ve yörüngede hareket eder.
 * Performans için yalnızca CSS transform animasyonu (GPU-hızlandırmalı) kullanılır.
 */

const BOOK_CONFIGS = [
  // sol üst
  { top: '5%', left: '3%', size: 54, rotate: -12, animation: 'animate-float-1', delay: '0s', opacity: 0.18 },
  { top: '15%', left: '14%', size: 38, rotate: 20, animation: 'animate-float-2', delay: '2s', opacity: 0.14 },
  // sol orta
  { top: '40%', left: '2%', size: 62, rotate: -8, animation: 'animate-float-3', delay: '1s', opacity: 0.16 },
  { top: '55%', left: '10%', size: 42, rotate: 15, animation: 'animate-float-4', delay: '3s', opacity: 0.12 },
  // sol alt
  { top: '75%', left: '5%', size: 48, rotate: -18, animation: 'animate-float-drift', delay: '0.5s', opacity: 0.15 },
  // sağ üst
  { top: '8%', right: '4%', size: 58, rotate: 10, animation: 'animate-float-2', delay: '1.5s', opacity: 0.17 },
  { top: '22%', right: '16%', size: 34, rotate: -25, animation: 'animate-float-1', delay: '4s', opacity: 0.12 },
  // sağ orta
  { top: '45%', right: '3%', size: 50, rotate: 22, animation: 'animate-float-4', delay: '2.5s', opacity: 0.16 },
  { top: '60%', right: '14%', size: 44, rotate: -14, animation: 'animate-float-3', delay: '0s', opacity: 0.13 },
  // sağ alt
  { top: '80%', right: '6%', size: 56, rotate: 8, animation: 'animate-float-1', delay: '3.5s', opacity: 0.18 },
  // orta üst-alt
  { top: '10%', left: '45%', size: 36, rotate: -5, animation: 'animate-float-drift', delay: '1s', opacity: 0.10 },
  { top: '85%', left: '40%', size: 40, rotate: 16, animation: 'animate-float-2', delay: '2s', opacity: 0.12 },
] as const;

const BOOK_COLORS = [
  '#2a4a7a',
  '#2d6685',
  '#276a6e',
  '#2d8a7a',
  '#257a56',
];

function BookSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 40 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Book body */}
      <rect x="4" y="2" width="32" height="48" rx="2" fill={color} />
      {/* Spine */}
      <rect x="4" y="2" width="6" height="48" rx="1" fill={color} opacity="0.8" />
      <line x1="10" y1="2" x2="10" y2="50" stroke="white" strokeOpacity="0.15" strokeWidth="0.5" />
      {/* Pages edge */}
      <rect x="10" y="4" width="24" height="44" rx="1" fill="white" fillOpacity="0.15" />
      {/* Title lines */}
      <rect x="14" y="12" width="16" height="2" rx="1" fill="white" fillOpacity="0.3" />
      <rect x="14" y="17" width="12" height="1.5" rx="0.75" fill="white" fillOpacity="0.2" />
      <rect x="14" y="22" width="14" height="1.5" rx="0.75" fill="white" fillOpacity="0.2" />
      {/* Bottom decoration */}
      <rect x="14" y="38" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.12" />
    </svg>
  );
}

export function FloatingBooks() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {BOOK_CONFIGS.map((config, i) => {
        const color = BOOK_COLORS[i % BOOK_COLORS.length];
        const style: React.CSSProperties = {
          position: 'absolute',
          top: config.top,
          left: 'left' in config ? config.left : undefined,
          right: 'right' in config ? config.right : undefined,
          opacity: config.opacity,
          transform: `rotate(${config.rotate}deg)`,
          animationDelay: config.delay,
        };

        return (
          <div
            key={i}
            className={config.animation}
            style={style}
          >
            <BookSVG size={config.size} color={color} />
          </div>
        );
      })}
    </div>
  );
}
