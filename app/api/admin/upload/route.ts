import { NextResponse, type NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** POST: FormData ile resim alır, Vercel Blob'a yükler, public URL döndürür. */
export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: 'Yalnızca JPG, PNG veya WEBP yüklenebilir' },
        { status: 415 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Dosya boyutu 10MB sınırını aşıyor' },
        { status: 413 },
      );
    }

    const filename = `press/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    const blob = await put(filename, file, { access: 'public' });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}
