import { EgitimlerGrid } from '@/components/home/EgitimlerGrid';
import { Hero } from '@/components/home/Hero';
import { StatsSection } from '@/components/home/StatsSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <EgitimlerGrid />
    </main>
  );
}
