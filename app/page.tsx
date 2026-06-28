import { EgitimlerGrid } from '@/components/home/EgitimlerGrid';
import { Hero } from '@/components/home/Hero';
import { StatsSection } from '@/components/home/StatsSection';
import { getSiteContent } from '@/lib/site-content';

// İstatistik ve eğitim verileri admin panelinden yönetilir. Sayfa önbelleğe alınır
// (hızlı gezinme); admin değişiklik yapınca revalidatePath('/') ile anında tazelenir.
// 1 saatlik süre yalnızca güvenlik amaçlı yedek tazelemedir.
export const revalidate = 3600;

export default async function HomePage() {
  const { stats, trainings } = await getSiteContent();

  return (
    <main>
      <Hero />
      <StatsSection stats={stats} />
      <EgitimlerGrid trainings={trainings} />
    </main>
  );
}
