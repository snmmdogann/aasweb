import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { publicationSchema } from '@/lib/admin-validation';
import type { Prisma } from '@prisma/client';

export const runtime = 'nodejs';

/** GET: yayınları döndürür. ?tur= ve ?q= (başlık/yazarlar) ile filtrelenebilir. */
export async function GET(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tur = searchParams.get('tur');
    const q = searchParams.get('q')?.trim();

    const where: Prisma.PublicationWhereInput = {};
    if (tur && ['makale', 'bildiri', 'kitap'].includes(tur)) {
      where.tur = tur;
    }
    if (q) {
      where.OR = [
        { baslik: { contains: q } },
        { yazarlar: { contains: q } },
      ];
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: [{ yil: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(publications);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

/** POST: yeni yayın ekler. */
export async function POST(request: NextRequest) {
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
    const created = await prisma.publication.create({
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
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
