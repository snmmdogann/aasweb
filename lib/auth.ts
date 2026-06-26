import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

// [DÜZENLE] - Tek yöneticili basit kimlik doğrulama. Üretimde kullanıcı adı/şifreyi
// ve özellikle JWT_SECRET'i ortam değişkenleriyle güçlü değerlerle değiştirin.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'aas';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'aas123';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'aas-admin-gizli-anahtar-2024',
);

export const COOKIE_NAME = 'admin_token';

/**
 * Kullanıcı adı/şifre doğruysa imzalı bir JWT üretip httpOnly çereze yazar.
 * @returns giriş başarılıysa true
 */
export async function signIn(
  username: string,
  password: string,
): Promise<boolean> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return true;
  }
  return false;
}

/** Oturum çerezini siler. */
export async function signOut(): Promise<void> {
  cookies().delete(COOKIE_NAME);
}

/** Geçerli oturumun JWT payload'ını döndürür, yoksa/ geçersizse null. */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

/** Oturum yoksa null döndürür; API route'larında 401 için kullanılır. */
export async function requireAuth(): Promise<JWTPayload | null> {
  return getSession();
}
