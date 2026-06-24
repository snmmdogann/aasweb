import { siteConfig } from '@/data/site-config';
import type { ContactFormValues } from './validations';

/** İlk gönderimde FormSubmit aktivasyon bekliyorsa fırlatılan özel hata. */
export const ACTIVATION_PENDING = 'ACTIVATION_PENDING';

/**
 * İletişim formu verisini FormSubmit.co üzerinden CONTACT_RECEIVER_EMAIL adresine
 * gönderir. Tamamen ücretsizdir; API anahtarı veya hesap gerektirmez.
 *
 * NOT: FormSubmit, isteğin bir web sayfasından geldiğini doğrulamak için Referer/Origin
 * başlığı bekler; bu çağrı sunucu tarafından yapıldığından bu başlıklar elle eklenir.
 * Ayrıca bir adrese İLK gönderimde FormSubmit, o adrese aktivasyon (onay) e-postası
 * yollar; içindeki bağlantıya bir kez tıklanınca adres etkinleşir.
 */
export async function sendContactEmail(data: ContactFormValues) {
  const to = process.env.CONTACT_RECEIVER_EMAIL;

  if (!to) {
    throw new Error(
      'E-posta yapılandırması eksik: CONTACT_RECEIVER_EMAIL ayarlanmalı.',
    );
  }

  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // FormSubmit'in isteği kabul etmesi için gereken tarayıcı başlıkları.
        Referer: siteConfig.url,
        Origin: siteConfig.url,
      },
      body: JSON.stringify({
        _subject: `[İletişim] ${data.konu} — ${data.ad}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: data.email,
        'Ad Soyad': data.ad,
        'E-posta': data.email,
        Konu: data.konu,
        Mesaj: data.mesaj,
      }),
    },
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  if (json.success === 'true' || json.success === true) {
    return;
  }

  // İlk gönderimde adres henüz etkinleştirilmemişse FormSubmit aktivasyon ister.
  if (/activat/i.test(json.message ?? '')) {
    throw new Error(ACTIVATION_PENDING);
  }

  throw new Error(json.message ?? 'E-posta gönderilemedi.');
}
