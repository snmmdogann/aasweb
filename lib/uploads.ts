import { unlink } from 'fs/promises';
import path from 'path';

// Yüklenen basın görsellerinin saklandığı klasör (public altında).
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'press');
export const UPLOAD_URL_PREFIX = '/uploads/press/';

/**
 * Verilen public URL'i bu uygulamanın yüklediği bir dosyaya işaret ediyorsa
 * (ör. /uploads/press/xxx.jpg) diskten siler. Harici URL'ler veya seed
 * görselleri (/images/...) yok sayılır. Hata olsa bile sessizce geçer.
 */
export async function deleteUploadIfLocal(
  imageUrl: string | null | undefined,
): Promise<void> {
  if (!imageUrl || !imageUrl.startsWith(UPLOAD_URL_PREFIX)) return;
  try {
    const filename = path.basename(imageUrl);
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // Dosya zaten yoksa veya silinemiyorsa görmezden gel.
  }
}
