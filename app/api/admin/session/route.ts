import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

/** GET: oturum varsa 200 + kullanıcı bilgisi, yoksa 401. Navbar bunu kullanır. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    username: session.username ?? null,
  });
}
