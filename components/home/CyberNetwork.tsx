'use client';

import { motion } from 'framer-motion';
import { Shield, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

const floatingChars = ['0', '1', 'Σ', '∫', '0', '1', 'λ', 'μ', '{ }', '</>'];

export function CyberNetwork() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative flex h-[650px] w-[650px] items-center justify-center">
      {/* ─── Arka Plan Ambient Işığı ─── */}
      <div className="absolute inset-0 rounded-full bg-primary-light/10 blur-[80px]" aria-hidden="true" />
      <motion.div 
        className="absolute inset-20 rounded-full bg-white/5 blur-[50px]" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ─── Yavaşça Dönen Dış Geometrik Ağ ─── */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full opacity-50 overflow-visible">
          {/* Kıvrımlı Organik Neural Bağlantılar */}
          <motion.path
            d="
              M 300, 300 Q 150, 200 -50, 150
              M 300, 300 Q 100, 400 -100, 450
              M 300, 300 Q 250, 100 200, -50
              M 300, 300 Q 450, 100 550, 50
              M 300, 300 Q 500, 250 650, 200
              M 300, 300 Q 450, 450 600, 550
              M 300, 300 Q 250, 500 200, 650
              M 300, 300 Q 100, 300 -150, 300
            "
            stroke="url(#glow-gradient)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />

          {/* Düğümler (Nodes) */}
          {[
            [-50, 150], [-100, 450], [200, -50], [550, 50],
            [650, 200], [600, 550], [200, 650], [-150, 300],
            [150, 200], [100, 400], [250, 100], [450, 100],
            [500, 250], [450, 450], [250, 500], [100, 300]
          ].map((pos, i) => (
            <circle 
              key={i} 
              cx={pos[0]} 
              cy={pos[1]} 
              r={i < 8 ? "4" : "2"} 
              fill="white" 
              className="animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
            />
          ))}

          {/* SVG Gradient Tanımı */}
          <defs>
            <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ─── Bağlantılar Üzerinden Merkez'e Akan Veriler / Semboller ─── */}
      {floatingChars.map((char, i) => {
        const angle = (i / floatingChars.length) * Math.PI * 2;
        const radius = 350; 
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;
        const endX = 0;
        const endY = 0;

        return (
          <motion.div
            key={i}
            className="absolute z-10 font-mono text-sm font-bold text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
            initial={{ x: startX, y: startY, opacity: 0, scale: 0.5 }}
            animate={{
              x: [startX, endX],
              y: [startY, endY],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          >
            {char}
          </motion.div>
        );
      })}

      {/* ─── Yüksek Teknoloji (High-Tech) Dönen Halkalar ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Dış Halka (Kesik Kesik - Ters Yönde Döner) */}
        <motion.div 
          className="absolute h-72 w-72 rounded-full border border-dashed border-white/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        {/* Orta Halka (Sürekli - Düz Yönde Döner) */}
        <motion.div 
          className="absolute h-56 w-56 rounded-full border-t border-r border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* İç Halka (Dinamik Parlayan Çizgiler) */}
        <motion.div 
          className="absolute h-48 w-48 rounded-full border border-dotted border-white/60 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]"
          animate={{ rotate: -360, scale: [1, 1.02, 1] }}
          transition={{ rotate: { duration: 15, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity, ease: 'easeInOut'} }}
        />
      </div>

      {/* ─── Odak Noktası: Kalkan ve Zeka (Beyin) ─── */}
      <div className="relative z-20 flex h-40 w-40 items-center justify-center rounded-full bg-primary-dark/50 shadow-[0_0_50px_rgba(255,255,255,0.15),inset_0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-xl border border-white/30">
        
        {/* Arkada Yavaşça Nabız Atan İç Parlaklık */}
        <motion.div 
          className="absolute inset-4 rounded-full bg-white/10 blur-md"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Dış Kalkan İkonu */}
        <Shield className="absolute h-28 w-28 text-white/40 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1} />
        
        {/* İç Beyin İkonu */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Brain className="relative z-30 h-14 w-14 text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)]" strokeWidth={1.5} />
        </motion.div>
      </div>

    </div>
  );
}
