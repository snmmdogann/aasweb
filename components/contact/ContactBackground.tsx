'use client';

import { motion } from 'framer-motion';

// Sabit geometrik ağ düğümleri (nodes)
const nodes = [
  [200, 200], [800, 150], [500, 500], [150, 800], [850, 850],
  [350, 300], [650, 350], [400, 700], [700, 650], [100, 500],
  [900, 450], [500, 150], [500, 850], [300, 100], [700, 100],
  [100, 300], [900, 750], [200, 600], [800, 550], [300, 900]
];

// Düğümleri birbirine bağlayan kollar (links)
const links = [
  [0, 5], [5, 2], [2, 6], [6, 1], [1, 10], [10, 6], [6, 8], [8, 4], [8, 2],
  [2, 7], [7, 3], [3, 9], [9, 0], [9, 5], [11, 0], [11, 5], [11, 2], [11, 6], [11, 1],
  [12, 3], [12, 7], [12, 2], [12, 8], [12, 4], [13, 0], [13, 11], [14, 11], [14, 1],
  [15, 9], [15, 0], [16, 4], [16, 10], [17, 9], [17, 3], [17, 7], [18, 10], [18, 8],
  [18, 6], [19, 3], [19, 7], [19, 12]
];

export function ContactBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen opacity-40">
      {/* Hafif parlak bir gradient kaplama */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light/5 via-transparent to-primary-dark/10" />

      {/* Çok Yavaş Dönen ve Nefes Alan Dev SVG Ağı */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-[150vw] w-[150vw] -translate-x-1/2 -translate-y-1/2 md:h-[120vw] md:w-[120vw] lg:h-[100vw] lg:w-[100vw]"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ 
          rotate: { duration: 250, repeat: Infinity, ease: 'linear' },
          scale: { duration: 15, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <svg viewBox="0 0 1000 1000" className="h-full w-full opacity-50">
          <defs>
            <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ağ Çizgileri */}
          {links.map(([n1, n2], i) => {
            const x1 = nodes[n1][0];
            const y1 = nodes[n1][1];
            const x2 = nodes[n2][0];
            const y2 = nodes[n2][1];

            return (
              <motion.line
                key={`link-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeWidth="0.8"
                initial={{ opacity: 0.1 }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut' }}
              />
            );
          })}

          {/* Düğümler ve Parlamalar */}
          {nodes.map((pos, i) => (
            <g key={`node-${i}`}>
              {/* Yumuşak dış parıltı */}
              <motion.circle 
                cx={pos[0]} 
                cy={pos[1]} 
                r="15" 
                fill="url(#node-glow)" 
                animate={{ opacity: [0.3, 0.8, 0.3], r: [12, 18, 12] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Keskin iç nokta */}
              <circle cx={pos[0]} cy={pos[1]} r="2" fill="white" className="opacity-90 drop-shadow-[0_0_2px_rgba(255,255,255,1)]" />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
