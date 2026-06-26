import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { pressItemSchema } from '@/lib/admin-validation';
import type { Prisma } from '@prisma/client';

export const runtime = 'nodejs';

/** GET: tüm basın öğelerini sıraNo'ya göre döndürür. ?tur= ile filtrelenebilir. */
export async function GET(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tur = searchParams.get('tur');

    const where: Prisma.PressItemWhereInput = {};
    if (tur && ['medya', 'haber'].includes(tur)) {
      where.tur = tur;
    }

    const items = await prisma.pressItem.findMany({
      where,
      orderBy: [{ siraNo: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

/** POST: yeni basın öğesi ekler (medya veya haber). */
export async function POST(request: NextRequest) {
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

    const d = parsed.data;

    // siraNo verilmediyse listenin sonuna ekle.
    let siraNo = d.siraNo ?? 0;
    if (!siraNo) {
      const last = await prisma.pressItem.findFirst({
        orderBy: { siraNo: 'desc' },
        select: { siraNo: true },
      });
      siraNo = (last?.siraNo ?? 0) + 1;
    }

    const created = await prisma.pressItem.create({
      data: {
        tur: d.tur,
        baslik: d.baslik ? d.baslik : null,
        aciklama: d.aciklama ? d.aciklama : null,
        imageUrl: d.imageUrl ?? '',
        haberUrl: d.tur === 'haber' && d.haberUrl ? d.haberUrl : null,
        siraNo,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
