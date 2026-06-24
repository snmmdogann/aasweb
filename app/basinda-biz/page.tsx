import type { Metadata } from 'next';
import { PressLogosMarquee } from '@/components/press/PressLogosMarquee';
import { PressMasonryGrid } from '@/components/press/PressMasonryGrid';

export const metadata: Metadata = {
  title: 'Basında Biz',
  description:
    'Dr. Öğr. Üyesi Ahmet Ali Süzen — televizyon programları, röportajlar ve basında yer alan haberler.',
};

export default function BasindaBizPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Basında Biz
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Televizyon programları, röportajlar ve basında yer alan haberler.
        </p>
      </header>

      <div className="mb-14">
        <PressLogosMarquee />
      </div>

      <PressMasonryGrid />
    </main>
  );
}
