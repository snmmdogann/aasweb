import { NextResponse, type NextRequest } from 'next/server';
import { requireAuth, getAdminUsername, updateCredentials } from '@/lib/auth';

export const runtime = 'nodejs';

/** GET: panelde göstermek için geçerli yönetici kullanıcı adını döndürür. */
export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
  const username = await getAdminUsername();
  return NextResponse.json({ username });
}

/** PUT: mevcut şifre doğrulanarak yalnızca şifreyi günceller (kullanıcı adı sabit). */
export async function PUT(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const currentPassword =
      typeof body?.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword =
      typeof body?.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Mevcut ve yeni şifre zorunludur' },
        { status: 400 },
      );
    }

    const result = await updateCredentials(currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
