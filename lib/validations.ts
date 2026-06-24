import { z } from 'zod';

// İletişim formu doğrulama şeması — FAZ 6'da ContactForm ve API route tarafından kullanılacak.
export const contactSchema = z.object({
  ad: z.string().min(2, 'Lütfen adınızı girin (en az 2 karakter).'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  konu: z.enum(['Kurumsal Eğitim', 'Seminer Daveti', 'Danışmanlık', 'Diğer']),
  mesaj: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır.'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
