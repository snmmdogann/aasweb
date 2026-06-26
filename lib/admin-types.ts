// İstemci tarafında (API'den JSON olarak gelen) admin verileri için tipler.
// Prisma model tipleriyle aynı alanları taşır; tarihler string'e serileşir.

export type PublicationTur = 'makale' | 'bildiri' | 'kitap';

export interface AdminPublication {
  id: string;
  baslik: string;
  yazarlar: string;
  dergiVeyaKonferans: string;
  yil: number;
  tur: PublicationTur;
  doiUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PressTur = 'medya' | 'haber';

export interface AdminPressItem {
  id: string;
  tur: PressTur;
  baslik: string | null;
  aciklama: string | null;
  imageUrl: string;
  haberUrl: string | null;
  siraNo: number;
  createdAt: string;
  updatedAt: string;
}

export const PUBLICATION_TUR_LABELS: Record<PublicationTur, string> = {
  makale: 'Makale',
  bildiri: 'Bildiri',
  kitap: 'Kitap',
};
