import type { Metadata } from 'next';
import { PressMarquee } from '@/components/press/PressMarquee';
import { PressGallery } from '@/components/press/PressGallery';

export const metadata: Metadata = {
  title: 'Basın ve Medya',
  description:
    'Doç. Dr. Ahmet Ali Süzen — basında ve medyada yer aldığı haber ve programlardan görseller.',
};

export default function BasindaBizPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Basın ve Medya
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Televizyon programları, röportajlar ve basında yer alan haberlerden
          görseller.
        </p>
      </header>

      <div className="mb-14">
        <PressMarquee />
      </div>

      <PressGallery />
    </main>
  );
}
