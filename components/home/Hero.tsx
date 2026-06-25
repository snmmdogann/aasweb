'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { useTypewriter } from '@/lib/useTypewriter';

// Hocanın portre fotoğrafı: public/images/ahmet-ali-suzen.jpg dosyasını koyunca
// otomatik gösterilir. Dosyayı koymadan önce null bırakırsan "AAS" monogramı görünür.
const portreUrl: string | null = '/images/ahmet-ali-suzen.jpg';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// İsimden monogram üret ("Ahmet Ali Süzen" → "AAS").
const monogram = siteConfig.name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .toUpperCase();

/**
 * Anasayfa kahraman (hero) bölümü: portre placeholder'ı, isim, rol rotasyonu
 * (daktilo efekti), motto ve iki yönlendirme butonu. İlk yüklemede stagger fade-in-up.
 */
export function Hero() {
  const role = useTypewriter(siteConfig.role);

  return (
    <section className="mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col items-center gap-12 px-6 pt-28 pb-16 md:flex-row md:gap-16 md:pt-24">
      {/* SOL: Portre placeholder */}
      <motion.div
        className="relative flex shrink-0 items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute -inset-6 rounded-full bg-primary-light/40 blur-2xl" aria-hidden="true" />
        <div className="absolute inset-0 rounded-full ring-2 ring-primary-light" aria-hidden="true" />
        <div className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-dark text-6xl font-bold text-white md:h-72 md:w-72">
          {portreUrl ? (
            <Image
              src={portreUrl}
              alt={siteConfig.name}
              fill
              priority
              sizes="(max-width: 768px) 14rem, 18rem"
              className="object-cover"
            />
          ) : (
            monogram
          )}
        </div>
      </motion.div>

      {/* SAĞ: İçerik */}
      <motion.div
        className="flex flex-col items-center text-center md:items-start md:text-left"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/70"
        >
          {siteConfig.title}
        </motion.p>

        <motion.h1
          variants={item}
          className="text-4xl font-bold text-white sm:text-5xl md:text-6xl"
        >
          {siteConfig.name}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 flex h-8 items-center text-xl font-medium text-white/80 sm:text-2xl"
          aria-live="polite"
        >
          <span>{role}</span>
          <span className="ml-1 inline-block h-6 w-0.5 animate-pulse bg-primary" aria-hidden="true" />
        </motion.p>

        {/* [DÜZENLE] - motto/vizyon cümlesi */}
        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Akademik derinliği sahadaki siber güvenlik tecrübesiyle birleştiriyorum.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/hakkimda"
            className="rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(27,70,97,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            [ Hakkımda ]
          </Link>
          <Link
            href="/iletisim"
            className="rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(27,70,97,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            [ İletişime Geç ]
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
