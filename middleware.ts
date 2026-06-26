import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_token';
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'aas-admin-gizli-anahtar-2024',
);

/**
 * `/admin` altındaki tüm sayfaları korur (login sayfası hariç).
 * Geçerli bir oturum çerezi yoksa `/admin/login`'e yönlendirir.
 * Edge runtime'da çalıştığı için JWT doğrulaması jose ile burada yapılır.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login sayfası ve auth API'si serbest.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, secret);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Yalnızca /admin sayfa rotalarını koru. API rotaları kendi içinde requireAuth kullanır.
  matcher: ['/admin/:path*'],
};
