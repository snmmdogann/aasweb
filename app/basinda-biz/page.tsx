import type { Metadata } from 'next';
import { PressMarquee } from '@/components/press/PressMarquee';
import {
  PressGallery,
  type PublicPressItem,
} from '@/components/press/PressGallery';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Basın ve Medya',
  description:
    'Doç. Dr. Ahmet Ali Süzen — basında ve medyada yer aldığı haber ve programlardan görseller.',
};

// Her istekte güncel veriyi veritabanından getir.
export const dynamic = 'force-dynamic';

export default async function BasindaBizPage() {
  const rows = await prisma.pressItem.findMany({
    orderBy: { siraNo: 'asc' },
  });

  const items: PublicPressItem[] = rows.map((row) => ({
    id: row.id,
    tur: row.tur as 'medya' | 'haber',
    baslik: row.baslik,
    aciklama: row.aciklama,
    imageUrl: row.imageUrl,
    haberUrl: row.haberUrl,
  }));

  // Marquee yalnızca medya görsellerini gösterir.
  const marqueeImages = items
    .filter((i) => i.tur === 'medya' && i.imageUrl)
    .map((i) => ({ id: i.id, src: i.imageUrl }));

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

      {marqueeImages.length > 0 && (
        <div className="mb-14">
          <PressMarquee images={marqueeImages} />
        </div>
      )}

      <PressGallery items={items} />
    </main>
  );
}
