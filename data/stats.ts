

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 15, suffix: '+', label: 'Yönetilen Proje' },
  { value: 100, suffix: '+', label: 'Eğitim' },
  { value: 250, suffix: '+', label: 'Sızma Testi' },
];
