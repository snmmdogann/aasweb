import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { siteContentUpdateSchema } from '@/lib/admin-validation';

export const runtime = 'nodejs';

/** GET: tüm site içeriklerini { id: value } sözlüğü olarak döndürür. */
export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const rows = await prisma.siteContent.findMany();
    const map: Record<string, string> = {};
    // admin.* anahtarları (kullanıcı adı / şifre hash'i) istemciye sızdırılmaz.
    for (const row of rows) {
      if (row.id.startsWith('admin.')) continue;
      map[row.id] = row.value;
    }
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

/** PUT: tek bir içeriği (id + value) günceller; yoksa oluşturur. */
export async function PUT(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = siteContentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Doğrulama hatası', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, value } = parsed.data;
    // Kimlik bilgileri yalnızca /api/admin/credentials üzerinden değiştirilebilir.
    if (id.startsWith('admin.')) {
      return NextResponse.json(
        { error: 'Bu anahtar bu uçtan değiştirilemez' },
        { status: 403 },
      );
    }
    const saved = await prisma.siteContent.upsert({
      where: { id },
      update: { value },
      create: { id, value },
    });

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
