'use client';

import { motion } from 'framer-motion';
import type { Training } from '@/data/trainings';
import { EgitimKart } from './EgitimKart';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function EgitimlerGrid({ trainings }: { trainings: Training[] }) {
  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* Statik arka plan — JS animasyonu yok, tamamen CSS */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="absolute -right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#F2E7CE]/15 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[30%] h-[400px] w-[400px] rounded-full bg-primary-light/20 blur-[80px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-dark/50" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
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
