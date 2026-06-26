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

/** PUT: mevcut şifre doğrulanarak kullanıcı adı ve şifreyi günceller. */
export async function PUT(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const currentPassword =
      typeof body?.currentPassword === 'string' ? body.currentPassword : '';
    const newUsername =
      typeof body?.newUsername === 'string' ? body.newUsername : '';
    const newPassword =
      typeof body?.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword || !newUsername || !newPassword) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 },
      );
    }

    const result = await updateCredentials(
      currentPassword,
      newUsername,
      newPassword,
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
