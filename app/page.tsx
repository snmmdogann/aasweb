import { EgitimlerGrid } from '@/components/home/EgitimlerGrid';
import { Hero } from '@/components/home/Hero';
import { StatsSection } from '@/components/home/StatsSection';
import { getSiteContent } from '@/lib/site-content';

// İstatistik ve eğitim verileri admin panelinden yönetilir; her istekte güncel oku.
export const dynamic = 'force-dynamic';

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
