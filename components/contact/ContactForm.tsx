'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactSchema, type ContactFormValues } from '@/lib/validations';
import { cn } from '@/lib/utils';

const konuOptions: ContactFormValues['konu'][] = [
  'Kurumsal Eğitim',
  'Seminer Daveti',
  'Danışmanlık',
  'Diğer',
];

const baseDefaults: ContactFormValues = {
  ad: '',
  email: '',
  konu: 'Kurumsal Eğitim',
  mesaj: '',
};

const inputClass =
  'w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30';

/** Input altında beliren, yumuşak fade-in'li hata mesajı. */
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/**
 * İletişim formu (react-hook-form + zod). Eğitim grid'inden gelen query ile
 * ön-doldurulmuş defaultValues alabilir. Başarıda formu temizler ve başarı
 * animasyonu gösterir; hata durumunda nazik bir mesaj verir.
 */
export function ContactForm({
  defaultValues,
}: {
  defaultValues?: Partial<ContactFormValues>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...baseDefaults, ...defaultValues },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };

      if (!res.ok || !json.ok) {
        setServerError(
          json.message ?? 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
        );
        return;
      }

      setSuccess(true);
      reset(baseDefaults);
    } catch {
      setServerError('Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="ad" className="mb-1.5 block text-sm font-medium text-ink">
          Ad Soyad
        </label>
        <input
          id="ad"
          {...register('ad')}
          className={cn(inputClass, errors.ad ? 'border-red-400' : 'border-ink/15')}
          aria-invalid={!!errors.ad}
        />
        <FieldError message={errors.ad?.message} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          E-posta
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={cn(inputClass, errors.email ? 'border-red-400' : 'border-ink/15')}
          aria-invalid={!!errors.email}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="konu" className="mb-1.5 block text-sm font-medium text-ink">
          Konu
        </label>
        <select
          id="konu"
          {...register('konu')}
          className={cn(inputClass, errors.konu ? 'border-red-400' : 'border-ink/15')}
        >
          {konuOptions.map((konu) => (
            <option key={konu} value={konu}>
              {konu}
            </option>
          ))}
        </select>
        <FieldError message={errors.konu?.message} />
      </div>

      <div>
        <label htmlFor="mesaj" className="mb-1.5 block text-sm font-medium text-ink">
          Mesaj
        </label>
        <textarea
          id="mesaj"
          rows={6}
          {...register('mesaj')}
          className={cn(inputClass, 'resize-y', errors.mesaj ? 'border-red-400' : 'border-ink/15')}
          aria-invalid={!!errors.mesaj}
        />
        <FieldError message={errors.mesaj?.message} />
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-lg bg-primary-light/30 px-4 py-3 text-primary-dark"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Mesajınız iletildi. Teşekkürler!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(66,116,217,0.6)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? 'Gönderiliyor…' : 'Gönder'}
      </button>
    </form>
  );
}
