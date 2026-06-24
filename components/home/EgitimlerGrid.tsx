'use client';

import { motion } from 'framer-motion';
import { trainings } from '@/data/trainings';
import { EgitimKart } from './EgitimKart';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/**
 * Anasayfanın "Kurumsal Eğitimler" bölümü: trainings.ts'ten beslenen,
 * scroll'a girince stagger ile beliren responsive 4'lü kart grid'i.
 */
export function EgitimlerGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Kurumsal Eğitimler
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Kurumların ihtiyaçlarına yönelik, siber güvenlik ve yazılım
          mühendisliği ekseninde uygulamalı eğitim programları.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {trainings.map((training) => (
          <EgitimKart key={training.slug} training={training} />
        ))}
      </motion.div>
    </section>
  );
}
