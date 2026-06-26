import { del } from '@vercel/blob';
import { unlink } from 'fs/promises';
import path from 'path';

// Eski yerel yükleme sabitleri — geriye dönük uyumluluk için korunuyor.
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'press');
export const UPLOAD_URL_PREFIX = '/uploads/press/';

/**
 * Verilen URL'e göre görseli siler:
 *  - "https://" ile başlıyorsa → Vercel Blob'dan sil.
 *  - "/uploads/press/" ile başlıyorsa → eski yerel diskten sil.
 *  - Diğer URL'ler (seed görselleri vb.) yok sayılır.
 * Hata olsa bile sessizce geçer.
 */
export async function deleteUploadIfLocal(
  imageUrl: string | null | undefined,
): Promise<void> {
  if (!imageUrl) return;

  try {
    if (imageUrl.startsWith('https://')) {
      await del(imageUrl);
      return;
    }

    if (imageUrl.startsWith(UPLOAD_URL_PREFIX)) {
      const filename = path.basename(imageUrl);
      await unlink(path.join(UPLOAD_DIR, filename));
    }
  } catch {
    // Dosya zaten yoksa veya silinemiyorsa görmezden gel.
  }
}
