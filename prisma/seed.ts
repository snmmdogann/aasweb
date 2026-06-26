import { PrismaClient } from '@prisma/client';
import { publications } from '../data/publications';
import { pressImages } from '../data/press';
import { bioParagraphs, expertiseAreas } from '../data/about';
import { stats } from '../data/stats';
import { trainings } from '../data/trainings';

const prisma = new PrismaClient();

/**
 * Mevcut statik TypeScript verilerini SQLite veritabanına aktarır.
 * Tekrar çalıştırıldığında tabloları sıfırlayıp yeniden doldurur (idempotent).
 *
 * SiteContent, esnek olması için JSON serileştirilmiş değerler saklar:
 *   - about.bio        → string[]  (biyografi paragrafları)
 *   - about.expertise  → string[]  (uzmanlık alanları)
 *   - stats            → { value, suffix, label }[]
 *   - trainings        → { slug, baslik, aciklama, icon }[]
 */
async function main() {
  console.log('🌱 Seed başlıyor...');

  // 1) Yayınlar
  await prisma.publication.deleteMany();
  for (const p of publications) {
    await prisma.publication.create({
      data: {
        baslik: p.baslik,
        yazarlar: p.yazarlar,
        dergiVeyaKonferans: p.dergiVeyaKonferans,
        yil: p.yil,
        tur: p.tur,
        doiUrl: p.doiUrl ?? null,
      },
    });
  }
  console.log(`   ✓ ${publications.length} yayın eklendi`);

  // 2) Basın görselleri (hepsi "medya" türünde)
  await prisma.pressItem.deleteMany();
  let sira = 0;
  for (const img of pressImages) {
    await prisma.pressItem.create({
      data: {
        tur: 'medya',
        baslik: null,
        aciklama: null,
        imageUrl: img.src,
        haberUrl: null,
        siraNo: sira++,
      },
    });
  }
  console.log(`   ✓ ${pressImages.length} basın görseli eklendi`);

  // 3) Site içerikleri (JSON olarak)
  const siteContents: { id: string; value: string }[] = [
    { id: 'about.bio', value: JSON.stringify(bioParagraphs) },
    { id: 'about.expertise', value: JSON.stringify(expertiseAreas) },
    { id: 'stats', value: JSON.stringify(stats) },
    { id: 'trainings', value: JSON.stringify(trainings) },
  ];
  for (const sc of siteContents) {
    await prisma.siteContent.upsert({
      where: { id: sc.id },
      update: { value: sc.value },
      create: sc,
    });
  }
  console.log(`   ✓ ${siteContents.length} site içeriği eklendi`);

  console.log('✅ Seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
