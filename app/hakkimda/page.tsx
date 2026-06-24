import type { Metadata } from 'next';
import { BioSection } from '@/components/about/BioSection';
import { UzmanlikBadge } from '@/components/about/UzmanlikBadge';
import { VerkosisBanner } from '@/components/about/VerkosisBanner';

export const metadata: Metadata = {
  title: 'Hakkımda',
  description:
    'Dr. Öğr. Üyesi Ahmet Ali Süzen — akademik geçmiş, uzmanlık alanları ve siber güvenlik çalışmaları.',
};

export default function HakkimdaPage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16">
        <header className="mx-auto mb-12 max-w-3xl">
          <h1 className="text-4xl font-bold text-primary-dark sm:text-5xl">
            Hakkımda
          </h1>
        </header>

        <BioSection />

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-primary-dark">
            Uzmanlık Alanları
          </h2>
          <UzmanlikBadge />
        </div>
      </section>

      <VerkosisBanner />
    </main>
  );
}
