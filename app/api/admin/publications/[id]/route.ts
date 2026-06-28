import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { publicationSchema } from '@/lib/admin-validation';

export const runtime = 'nodejs';

/** PUT: var olan yayını günceller. */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = publicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Doğrulama hatası', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const updated = await prisma.publication.update({
      where: { id: params.id },
      data: {
        baslik: data.baslik,
        yazarlar: data.yazarlar,
        dergiVeyaKonferans: data.dergiVeyaKonferans ?? '',
        yil: data.yil,
        tur: data.tur,
        doiUrl: data.doiUrl ? data.doiUrl : null,
      },
    });

    revalidatePath('/akademi');
    return NextResponse.json(updated);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Yayın bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

/** DELETE: yayını siler. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    await prisma.publication.delete({ where: { id: params.id } });
    revalidatePath('/akademi');
    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Yayın bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
