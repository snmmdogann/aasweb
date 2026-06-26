

export interface Training {
  slug: string;
  baslik: string;
  aciklama: string;
  icon: string;
}

export const trainings: Training[] = [
  {
    slug: 'etik-hacking-sizma-testi',
    baslik: 'Etik Hackerlık ve Sızma Testi',
    aciklama:
      'Saldırgan bakış açısıyla sistemlerdeki güvenlik açıklarının tespiti ve raporlanması.',
    icon: 'ShieldAlert',
  },
  {
    slug: 'guvenli-yazilim-gelistirme',
    baslik: 'Güvenli Yazılım Geliştirme (Secure SDLC)',
    aciklama:
      'Yazılım yaşam döngüsünün her aşamasına güvenliğin entegre edilmesi.',
    icon: 'Code2',
  },
  {
    slug: 'adli-bilisim-temelleri',
    baslik: 'Adli Bilişim (Digital Forensics) Temelleri',
    aciklama:
      'Dijital delillerin toplanması, korunması ve analiz edilmesi süreçleri.',
    icon: 'Fingerprint',
  },
  {
    slug: 'kvkk-bilgi-guvenligi-farkindalik',
    baslik: 'KVKK ve Bilgi Güvenliği Farkındalık Eğitimi',
    aciklama:
      'Kişisel verilerin korunması ve kurum çapında güvenlik kültürünün oluşturulması.',
    icon: 'FileLock2',
  },
  {
    slug: 'ag-guvenligi-osint',
    baslik: 'Ağ Güvenliği ve OSINT Teknikleri',
    aciklama:
      'Ağ savunma stratejileri ve açık kaynak istihbarat toplama yöntemleri.',
    icon: 'Network',
  },
  {
    slug: 'iso-27001-bgys',
    baslik: 'ISO 27001 Bilgi Güvenliği Yönetim Sistemi',
    aciklama:
      'Standart gereksinimleri, risk yönetimi ve denetime hazırlık süreçleri.',
    icon: 'BadgeCheck',
  },
  {
    slug: 'siber-tehdit-istihbarati',
    baslik: 'Siber Tehdit İstihbaratı',
    aciklama:
      'Tehdit aktörlerinin ve saldırı eğilimlerinin proaktif olarak izlenmesi.',
    icon: 'Radar',
  },
  {
    slug: 'python-ile-guvenlik-otomasyonu',
    baslik: 'Python ile Güvenlik Otomasyonu',
    aciklama:
      'Güvenlik operasyonlarının betikler ve araçlarla otomatikleştirilmesi.',
    icon: 'Terminal',
  },
];

/** Eğitim slug'ını gerçek başlığa çevirir (iletişim formu ön-doldurması için). */
export function egitimAdiToBaslik(slug: string): string | undefined {
  return trainings.find((training) => training.slug === slug)?.baslik;
}
