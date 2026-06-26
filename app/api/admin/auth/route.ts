import { NextResponse, type NextRequest } from 'next/server';
import { signIn, signOut } from '@/lib/auth';

export const runtime = 'nodejs';

/** POST: kullanıcı adı + şifre ile giriş. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const username = typeof body?.username === 'string' ? body.username : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre zorunludur' },
        { status: 400 },
      );
    }

    const ok = await signIn(username, password);
    if (!ok) {
      return NextResponse.json(
        { error: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

/** DELETE: çıkış yap. */
export async function DELETE() {
  try {
    await signOut();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
