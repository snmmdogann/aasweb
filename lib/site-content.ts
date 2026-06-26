import { prisma } from '@/lib/prisma';
import { bioParagraphs as defaultBio, expertiseAreas as defaultExpertise } from '@/data/about';
import { stats as defaultStats, type Stat } from '@/data/stats';
import { trainings as defaultTrainings, type Training } from '@/data/trainings';
import { siteConfig } from '@/data/site-config';

export interface SiteContentData {
  bioParagraphs: string[];
  expertiseAreas: string[];
  stats: Stat[];
  trainings: Training[];
  contactEmail: string;
}

function parseOr<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    // Boş dizi gelirse de geçerli sayılır; yalnızca tamamen bozuk JSON'da fallback.
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Hakkında / istatistik / eğitim içeriklerini SiteContent tablosundan okur.
 * Bir anahtar eksikse veya değeri bozuksa, ilgili statik veri dosyasına düşer.
 * Böylece admin panelinden yapılan düzenlemeler ana sayfa ve hakkımda sayfasına
 * yansır; veritabanı henüz seed edilmemişse site yine de çalışır.
 */
export async function getSiteContent(): Promise<SiteContentData> {
  let map: Record<string, string> = {};
  try {
    const rows = await prisma.siteContent.findMany();
    for (const row of rows) map[row.id] = row.value;
  } catch {
    map = {};
  }

  return {
    bioParagraphs: parseOr<string[]>(map['about.bio'], defaultBio),
    expertiseAreas: parseOr<string[]>(map['about.expertise'], defaultExpertise),
    stats: parseOr<Stat[]>(map['stats'], defaultStats),
    trainings: parseOr<Training[]>(map['trainings'], defaultTrainings),
    // contact.email düz metin saklanır (JSON değil); boşsa site-config'e düşer.
    contactEmail: map['contact.email']?.trim() || siteConfig.email,
  };
}
