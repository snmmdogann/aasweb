import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { egitimAdiToBaslik } from '@/data/trainings';
import type { ContactFormValues } from '@/lib/validations';

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'Dr. Öğr. Üyesi Ahmet Ali Süzen ile iletişime geçin — kurumsal eğitim, seminer daveti ve danışmanlık talepleri.',
};

export default function IletisimPage({
  searchParams,
}: {
  searchParams: { konu?: string; egitimAdi?: string };
}) {
  // Eğitim grid'inden gelindiyse konuyu ve mesajı ön-doldur (FAZ 2 mekanizması).
  let defaultValues: Partial<ContactFormValues> | undefined;
  if (searchParams.konu === 'egitim') {
    const baslik = egitimAdiToBaslik(searchParams.egitimAdi ?? '');
    defaultValues = {
      konu: 'Kurumsal Eğitim',
      mesaj: baslik ? `İlgilendiğim eğitim: ${baslik}\n\n` : '',
    };
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-28 pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary-dark sm:text-5xl">
          İletişim
        </h1>
        <p className="mt-3 max-w-2xl text-ink/70">
          Kurumsal eğitim, seminer daveti veya danışmanlık talepleriniz için
          aşağıdaki formu doldurabilirsiniz.
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-[1fr_minmax(220px,280px)]">
        <ContactForm defaultValues={defaultValues} />
        <ContactInfo />
      </div>
    </main>
  );
}
