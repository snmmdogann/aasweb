import Link from 'next/link';
import { BookOpen, FileText, Newspaper, GraduationCap } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PUBLICATION_TUR_LABELS } from '@/lib/admin-types';
import { AccountSettings } from '@/components/admin/AccountSettings';

export const dynamic = 'force-dynamic';

type YayinOzet = { id: string; baslik: string; yil: number; tur: string };

const turBadge: Record<string, string> = {
  makale: 'bg-sky-500/15 text-sky-300',
  bildiri: 'bg-violet-500/15 text-violet-300',
  kitap: 'bg-amber-500/15 text-amber-300',
};

export default async function AdminDashboardPage() {
  const [
    toplamYayin,
    makaleSayisi,
    bildiriSayisi,
    kitapSayisi,
    basinSayisi,
    sonYayinlar,
    sonBasin,
  ] = await Promise.all([
    prisma.publication.count(),
    prisma.publication.count({ where: { tur: 'makale' } }),
    prisma.publication.count({ where: { tur: 'bildiri' } }),
    prisma.publication.count({ where: { tur: 'kitap' } }),
    prisma.pressItem.count(),
    prisma.publication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.pressItem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  const cards = [
    {
      label: 'Toplam Yayın',
      value: toplamYayin,
      Icon: BookOpen,
      color: 'from-sky-500/20 to-sky-500/5 text-sky-300',
    },
    {
      label: 'Makale',
      value: makaleSayisi,
      Icon: FileText,
      color: 'from-violet-500/20 to-violet-500/5 text-violet-300',
    },
    {
      label: 'Bildiri',
      value: bildiriSayisi,
      Icon: GraduationCap,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300',
    },
    {
      label: 'Basın Öğesi',
      value: basinSayisi,
      Icon: Newspaper,
      color: 'from-amber-500/20 to-amber-500/5 text-amber-300',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Hoş geldiniz, Dr. Süzen
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Sitenizin içeriklerini buradan yönetebilirsiniz.
        </p>
      </header>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className={`rounded-2xl border border-white/10 bg-gradient-to-br ${color} p-5`}
          >
            <div className="flex items-center justify-between">
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-white/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Son yayınlar */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Yayınlarım</h2>
            <Link
              href="/admin/yayinlar"
              className="text-sm text-primary-light hover:underline"
            >
              Tümünü gör
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {sonYayinlar.length === 0 ? (
              <p className="p-5 text-sm text-white/40">Henüz yayın yok.</p>
            ) : (
              <>
                {/* Mobil kart listesi */}
                <div className="divide-y divide-white/5 sm:hidden">
                  {sonYayinlar.map((y: YayinOzet) => (
                    <div key={y.id} className="flex items-start justify-between gap-3 px-4 py-3">
                      <p className="line-clamp-2 text-sm text-white/80">{y.baslik}</p>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${turBadge[y.tur] ?? 'bg-white/10 text-white/70'}`}
                        >
                          {PUBLICATION_TUR_LABELS[y.tur as keyof typeof PUBLICATION_TUR_LABELS] ?? y.tur}
                        </span>
                        <span className="text-xs text-white/50">{y.yil}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Masaüstü tablo */}
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                      <tr>
                        <th className="px-4 py-3 font-medium">Başlık</th>
                        <th className="px-4 py-3 font-medium">Yıl</th>
                        <th className="px-4 py-3 font-medium">Tür</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sonYayinlar.map((y: YayinOzet) => (
                        <tr key={y.id} className="border-b border-white/5 last:border-0">
                          <td className="max-w-xs truncate px-4 py-3 text-white/80">
                            {y.baslik}
                          </td>
                          <td className="px-4 py-3 text-white/60">{y.yil}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${turBadge[y.tur] ?? 'bg-white/10 text-white/70'}`}
                            >
                              {PUBLICATION_TUR_LABELS[y.tur as keyof typeof PUBLICATION_TUR_LABELS] ?? y.tur}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Son basın öğeleri */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Son Basın</h2>
            <Link
              href="/admin/basin"
              className="text-sm text-primary-light hover:underline"
            >
              Tümünü gör
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3">
            {sonBasin.length === 0 ? (
              <p className="col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/40">
                Henüz öğe yok.
              </p>
            ) : (
              sonBasin.map((b) => (
                <div
                  key={b.id}
                  className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.imageUrl}
                    alt={b.baslik ?? 'Basın görseli'}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Yönetici giriş bilgilerini güncelleme */}
      <AccountSettings />
    </div>
  );
}
