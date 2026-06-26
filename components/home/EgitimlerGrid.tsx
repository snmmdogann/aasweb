'use client';

import { motion } from 'framer-motion';
import type { Training } from '@/data/trainings';
import { EgitimKart } from './EgitimKart';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/**
 * Anasayfanın "Kurumsal Eğitimler" bölümü: trainings.ts'ten beslenen,
 * scroll'a girince stagger ile beliren responsive 4'lü kart grid'i.
 */
export function EgitimlerGrid({ trainings }: { trainings: Training[] }) {
  return (
    <section className="relative w-full py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Hareketli Izgara (Grid) Deseni */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Daha Parlak Yansımalar (Glowing Orbs) */}
        <motion.div
          className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-teal-500/30 blur-[120px]"
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -right-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#F2E7CE]/20 blur-[120px]"
          animate={{
            x: [0, -150, 0],
            y: [0, 120, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-primary-light/30 blur-[100px]"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -80, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Grid'in kenarlarını yumuşatmak için karartma katmanı */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-dark/50" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Kurumsal Eğitimler
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Kurumların ihtiyaçlarına yönelik, siber güvenlik ve yazılım
            mühendisliği ekseninde uygulamalı eğitim programları.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {trainings.map((training) => (
            <EgitimKart key={training.slug} training={training} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
