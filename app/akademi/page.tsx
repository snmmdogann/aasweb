import type { Metadata } from 'next';
import { PublicationList } from '@/components/academy/PublicationList';
import { ScholarLinks } from '@/components/academy/ScholarLinks';
import { FloatingBooks } from '@/components/academy/FloatingBooks';
import { publications } from '@/data/publications';

export const metadata: Metadata = {
  title: 'Akademi — Yayınlar ve Akademik Çalışmalar',
  description:
    'Doç. Dr. Ahmet Ali Süzen — akademik yayınlar, makaleler, bildiriler ve araştırma çalışmaları.',
};

export default function AkademiPage() {
  return (
    <>
      {/* Arka planda süzülen kitap silüetleri */}
      <FloatingBooks />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-20">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl tracking-tight">
            Akademi
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-white/60 text-lg">
            Akademik yayınlar, makaleler, bildiriler ve kitaplar.
          </p>
          <p className="mt-1 text-sm text-white/40">
            Toplam {publications.length} yayın
          </p>
        </header>

        <div className="mb-16">
          <ScholarLinks />
        </div>

        <section>
          <h2 className="mb-8 text-center text-2xl font-semibold text-white/90">
            Yayın Kütüphanesi
          </h2>
          <PublicationList />
        </section>
      </main>
    </>
  );
}

