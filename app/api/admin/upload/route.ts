import { NextResponse, type NextRequest } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { requireAuth } from '@/lib/auth';
import { UPLOAD_DIR, UPLOAD_URL_PREFIX } from '@/lib/uploads';

export const runtime = 'nodejs';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** POST: FormData ile resim alır, public/uploads/press/ altına kaydeder, URL döndürür. */
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

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), bytes);

    return NextResponse.json({ url: `${UPLOAD_URL_PREFIX}${filename}` });
  } catch {
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}
