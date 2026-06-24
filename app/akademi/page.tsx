import type { Metadata } from 'next';
import { PublicationList } from '@/components/academy/PublicationList';
import { ScholarLinks } from '@/components/academy/ScholarLinks';
import { publications } from '@/data/publications';

export const metadata: Metadata = {
  title: 'Akademi — Yayınlar ve Akademik Çalışmalar',
  description:
    'Doç. Dr. Ahmet Ali Süzen — akademik yayınlar, makaleler, bildiriler ve araştırma çalışmaları.',
};

export default function AkademiPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Akademi
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Akademik yayınlar, makaleler ve bildiriler.
        </p>
      </header>

      <ScholarLinks />

      <div className="mb-6 mt-14 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-semibold text-white">Yayınlar</h2>
        <p className="text-sm text-white/50">
          Toplam {publications.length} yayın · DOI&apos;si olan makalelerde
          İncele bağlantısı yer alır
        </p>
      </div>
      <PublicationList />
    </main>
  );
}
