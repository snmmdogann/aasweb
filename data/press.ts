// Basında biz — FAZ 5'te PressMasonryGrid/PressLogosMarquee tarafından kullanılacak.
// [DÜZENLE] - gerçek TV/YouTube/haber linkleriyle değiştirilecek.

export type PressType = 'video' | 'haber';

export interface PressItem {
  id: string;
  tip: PressType;
  baslik: string;
  kaynakAdi: string;
  /** Kaynak logosu (şimdilik placeholder) */
  kaynakLogoUrl: string;
  /** Video kayıtları için embed URL */
  videoEmbedUrl?: string;
  /** Haber kayıtları için dış bağlantı */
  haberUrl?: string;
  /** ISO tarih (YYYY-MM-DD) */
  tarih: string;
}

export const press: PressItem[] = [
  {
    id: 'press-1',
    tip: 'video',
    baslik: 'Siber Güvenlikte Güncel Tehditler ve Korunma Yöntemleri',
    kaynakAdi: 'TRT Haber',
    kaynakLogoUrl: '/images/press/placeholder.png',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tarih: '2023-11-12',
  },
  {
    id: 'press-2',
    tip: 'haber',
    baslik: 'KVKK Uyum Süreçlerinde Kurumların Dikkat Etmesi Gerekenler',
    kaynakAdi: 'Anadolu Ajansı',
    kaynakLogoUrl: '/images/press/placeholder.png',
    haberUrl: 'https://example.com/haber-2',
    tarih: '2023-06-04',
  },
  {
    id: 'press-3',
    tip: 'video',
    baslik: 'Yapay Zekâ Çağında Bilgi Güvenliği',
    kaynakAdi: 'CNN Türk',
    kaynakLogoUrl: '/images/press/placeholder.png',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tarih: '2024-02-20',
  },
  {
    id: 'press-4',
    tip: 'haber',
    baslik: 'Sızma Testlerinin Kurumsal Güvenlikteki Rolü',
    kaynakAdi: 'Hürriyet',
    kaynakLogoUrl: '/images/press/placeholder.png',
    haberUrl: 'https://example.com/haber-4',
    tarih: '2022-09-15',
  },
  {
    id: 'press-5',
    tip: 'haber',
    baslik: 'Üniversite-Sanayi İş Birliğiyle Siber Güvenlik Projeleri',
    kaynakAdi: 'Dünya Gazetesi',
    kaynakLogoUrl: '/images/press/placeholder.png',
    haberUrl: 'https://example.com/haber-5',
    tarih: '2023-03-08',
  },
  {
    id: 'press-6',
    tip: 'video',
    baslik: 'OSINT ile Açık Kaynak İstihbaratı',
    kaynakAdi: 'NTV',
    kaynakLogoUrl: '/images/press/placeholder.png',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tarih: '2024-05-01',
  },
];
