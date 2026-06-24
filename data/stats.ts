// İstatistik kartları — FAZ 1'de StatsSection/useCountUp tarafından kullanılacak.
// [DÜZENLE] - gerçek/güncel rakamlarla teyit edilecek.

export interface Stat {
  /** Hedef sayı (useCountUp 0'dan buraya sayar) */
  value: number;
  /** Sayının sonuna eklenecek ek (ör. "+") */
  suffix: string;
  /** Kart etiketi */
  label: string;
}

export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Yönetilen Proje' }, // [DÜZENLE]
  { value: 100, suffix: '+', label: 'Eğitim' }, // [DÜZENLE]
  { value: 250, suffix: '+', label: 'Sızma Testi' }, // [DÜZENLE]
];
