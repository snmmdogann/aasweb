import { type Publication, type PublicationType } from '@/data/publications';
import { BookCard } from './BookCard';

const groups: { tur: PublicationType; label: string }[] = [
  { tur: 'makale', label: 'Makaleler' },
  { tur: 'bildiri', label: 'Bildiriler' },
  { tur: 'kitap', label: 'Kitaplar' },
];

/**
 * Yayınları üç 3D kitap kartı halinde yan yana gösterir
 * (Makaleler · Bildiriler · Kitaplar). Hover'da kitap açılır,
 * tıklayınca ortaya büyür ve sayfa çevirme efektiyle içerik gösterilir.
 *
 * Yayın listesi prop olarak alınır; veriler veritabanından beslenir.
 */
export function PublicationList({
  publications,
}: {
  publications: Publication[];
}) {
  const grouped = groups.map((group) => ({
    ...group,
    items: publications
      .filter((publication) => publication.tur === group.tur)
      .sort((a, b) => b.yil - a.yil),
  }));

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:items-start justify-items-center">
      {grouped.map((group) => (
        <BookCard
          key={group.tur}
          tur={group.tur}
          label={group.label}
          items={group.items}
        />
      ))}
    </div>
  );
}
