import type { Metadata } from 'next';
import { BioSection } from '@/components/about/BioSection';
import { UzmanlikBadge } from '@/components/about/UzmanlikBadge';
import { VerkosisBanner } from '@/components/about/VerkosisBanner';
import { getSiteContent } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Hakkımda',
  description:
    'Dr. Öğr. Üyesi Ahmet Ali Süzen — akademik geçmiş, uzmanlık alanları ve siber güvenlik çalışmaları.',
};

// Biyografi ve uzmanlık alanları admin panelinden yönetilir. Sayfa önbelleğe alınır
// (hızlı gezinme); admin değişiklik yapınca revalidatePath('/hakkimda') ile tazelenir.
export const revalidate = 3600;

export default async function HakkimdaPage() {
  const { bioParagraphs, expertiseAreas } = await getSiteContent();

  return (
    <main>
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16">
        <header className="mx-auto mb-12 max-w-3xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Hakkımda
          </h1>
        </header>

        <BioSection paragraphs={bioParagraphs} />

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-white">
            Uzmanlık Alanları
          </h2>
          <UzmanlikBadge areas={expertiseAreas} />
        </div>
      </section>

      <VerkosisBanner />
    </main>
  );
}
