import { z } from 'zod';

// Yayın doğrulama şeması (oluşturma + güncelleme).
export const publicationSchema = z.object({
  baslik: z.string().trim().min(1, 'Başlık zorunludur'),
  yazarlar: z.string().trim().min(1, 'Yazarlar zorunludur'),
  dergiVeyaKonferans: z.string().trim().default(''),
  yil: z.coerce
    .number()
    .int()
    .min(1900, 'Geçerli bir yıl girin')
    .max(2100, 'Geçerli bir yıl girin'),
  tur: z.enum(['makale', 'bildiri', 'kitap']),
  doiUrl: z
    .string()
    .trim()
    .url('Geçerli bir URL girin')
    .optional()
    .or(z.literal('')),
});

export type PublicationInput = z.infer<typeof publicationSchema>;

// Basın öğesi doğrulama şeması. Tür "medya" veya "haber".
export const pressItemSchema = z
  .object({
    tur: z.enum(['medya', 'haber']),
    baslik: z.string().trim().optional().or(z.literal('')),
    aciklama: z.string().trim().optional().or(z.literal('')),
    imageUrl: z.string().trim().optional().or(z.literal('')),
    haberUrl: z.string().trim().optional().or(z.literal('')),
    siraNo: z.coerce.number().int().default(0),
  })
  .superRefine((data, ctx) => {
    if (data.tur === 'haber') {
      if (!data.baslik || data.baslik.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['baslik'],
          message: 'Haber başlığı zorunludur',
        });
      }
      if (!data.haberUrl || data.haberUrl.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['haberUrl'],
          message: 'Haber URL’i zorunludur',
        });
      }
    } else {
      // medya: bir görsel yolu zorunlu
      if (!data.imageUrl || data.imageUrl.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['imageUrl'],
          message: 'Görsel zorunludur',
        });
      }
    }
  });

export type PressItemInput = z.infer<typeof pressItemSchema>;

export const siteContentUpdateSchema = z.object({
  id: z.string().trim().min(1),
  value: z.string(),
});
