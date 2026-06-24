import { NextResponse, type NextRequest } from 'next/server';
import { ACTIVATION_PENDING, sendContactEmail } from '@/lib/email';
import { contactSchema } from '@/lib/validations';

// Basit in-memory throttle: aynı IP'den dakikada en fazla 1 mesaj.
// (Production'da çok örnekli dağıtımda kalıcı bir store ile değiştirilebilir.)
const lastRequestByIp = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60_000;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const now = Date.now();
  const last = lastRequestByIp.get(ip);

  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      { ok: false, message: 'Çok sık deniyorsunuz. Lütfen biraz sonra tekrar deneyin.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Geçersiz istek gövdesi.' },
      { status: 400 },
    );
  }

  // Sunucu tarafı doğrulama (istemci doğrulamasından bağımsız).
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: 'Form bilgileri geçersiz.', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    await sendContactEmail(parsed.data);
    lastRequestByIp.set(ip, now);
    return NextResponse.json({ ok: true, message: 'Mesajınız iletildi.' });
  } catch (error) {
    // İlk gönderimde adres henüz etkinleştirilmemişse kullanıcıyı bilgilendir.
    if (error instanceof Error && error.message === ACTIVATION_PENDING) {
      return NextResponse.json(
        {
          ok: false,
          message:
            'Form ilk kez kullanılıyor. Alıcı e-posta adresine gönderilen onay (Activate Form) bağlantısına bir kez tıklayıp tekrar deneyin.',
        },
        { status: 503 },
      );
    }

    console.error('İletişim e-postası gönderilemedi:', error);
    return NextResponse.json(
      { ok: false, message: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 },
    );
  }
}
