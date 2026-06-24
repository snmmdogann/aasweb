import { publications, type PublicationType } from '@/data/publications';
import { PublicationDropdown } from './PublicationDropdown';

const groups: { tur: PublicationType; label: string }[] = [
  { tur: 'makale', label: 'Makaleler' },
  { tur: 'bildiri', label: 'Bildiriler' },
  { tur: 'kitap', label: 'Kitaplar' },
];

// Yayınları türlerine göre grupla ve her grubu yıla göre azalan sırala (modül düzeyinde, bir kez).
const grouped = groups.map((group) => ({
  ...group,
  items: publications
    .filter((publication) => publication.tur === group.tur)
    .sort((a, b) => b.yil - a.yil),
}));

/**
 * Yayınları üç açılır (dropdown) kart halinde yan yana gösterir
 * (Makaleler · Bildiriler · Kitaplar). Her kart hover/tıklama ile açılır.
 */
export function PublicationList() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
      {grouped.map((group) => (
        <PublicationDropdown
          key={group.tur}
          tur={group.tur}
          label={group.label}
          items={group.items}
        />
      ))}
    </div>
  );
}
