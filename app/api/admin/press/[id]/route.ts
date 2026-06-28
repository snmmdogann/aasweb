import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { pressItemSchema } from '@/lib/admin-validation';
import { deleteUploadIfLocal } from '@/lib/uploads';

export const runtime = 'nodejs';

/** PUT: basın öğesini günceller. Görsel değiştiyse eski yerel dosyayı siler. */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = pressItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Doğrulama hatası', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await prisma.pressItem.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Öğe bulunamadı' }, { status: 404 });
    }

    const d = parsed.data;
    const newImageUrl = d.imageUrl ?? '';

    // Görsel değiştiyse eski yüklenmiş dosyayı temizle.
    if (existing.imageUrl && existing.imageUrl !== newImageUrl) {
      await deleteUploadIfLocal(existing.imageUrl);
    }

    const updated = await prisma.pressItem.update({
      where: { id: params.id },
      data: {
        tur: d.tur,
        baslik: d.baslik ? d.baslik : null,
        aciklama: d.aciklama ? d.aciklama : null,
        imageUrl: newImageUrl,
        haberUrl: d.tur === 'haber' && d.haberUrl ? d.haberUrl : null,
        siraNo: d.siraNo ?? existing.siraNo,
      },
    });

    revalidatePath('/basinda-biz');
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

/** DELETE: öğeyi siler ve varsa yüklenmiş görsel dosyasını da kaldırır. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const existing = await prisma.pressItem.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Öğe bulunamadı' }, { status: 404 });
    }

    await prisma.pressItem.delete({ where: { id: params.id } });
    await deleteUploadIfLocal(existing.imageUrl);

    revalidatePath('/basinda-biz');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
