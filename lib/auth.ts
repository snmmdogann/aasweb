import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Varsayılan kimlik bilgileri — yönetici panelinden değiştirilene kadar geçerlidir.
// Değiştirildiğinde kullanıcı adı ve şifre (hash'li) SiteContent tablosunda saklanır.
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME ?? 'aas';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? 'aas123';

const USERNAME_KEY = 'admin.username';
const PASSWORD_HASH_KEY = 'admin.passwordHash';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'aas-admin-gizli-anahtar-2024',
);

export const COOKIE_NAME = 'admin_token';

interface StoredCredentials {
  username: string;
  passwordHash: string | null; // null ise varsayılan şifre düz metin karşılaştırılır
}

/** Saklanan yönetici kimlik bilgilerini okur; yoksa varsayılanlara düşer. */
async function getStoredCredentials(): Promise<StoredCredentials> {
  try {
    const rows = await prisma.siteContent.findMany({
      where: { id: { in: [USERNAME_KEY, PASSWORD_HASH_KEY] } },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.id] = r.value;
    return {
      username: map[USERNAME_KEY]?.trim() || DEFAULT_USERNAME,
      passwordHash: map[PASSWORD_HASH_KEY] || null,
    };
  } catch {
    return { username: DEFAULT_USERNAME, passwordHash: null };
  }
}

/** Verilen şifreyi saklanan kimlik bilgileriyle doğrular. */
async function verifyPassword(
  password: string,
  creds: StoredCredentials,
): Promise<boolean> {
  if (creds.passwordHash) {
    return bcrypt.compare(password, creds.passwordHash);
  }
  // Henüz özel şifre belirlenmemiş → varsayılan ile karşılaştır.
  return password === DEFAULT_PASSWORD;
}

/**
 * Kullanıcı adı/şifre doğruysa imzalı bir JWT üretip httpOnly *oturum* çerezine
 * yazar. maxAge belirtilmediği için çerez tarayıcı kapanınca silinir; böylece
 * site her yeniden açıldığında yöneticinin tekrar giriş yapması gerekir.
 * @returns giriş başarılıysa true
 */
export async function signIn(
  username: string,
  password: string,
): Promise<boolean> {
  const creds = await getStoredCredentials();
  if (username !== creds.username) return false;
  if (!(await verifyPassword(password, creds))) return false;

  const token = await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    // maxAge/expires YOK → oturum çerezi (tarayıcı kapanınca silinir).
    path: '/',
  });
  return true;
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

/** Panelde göstermek için geçerli yönetici kullanıcı adını döndürür. */
export async function getAdminUsername(): Promise<string> {
  return (await getStoredCredentials()).username;
}

export interface UpdateCredentialsResult {
  ok: boolean;
  error?: string;
}

/**
 * Mevcut şifre doğrulandıktan sonra yalnızca yönetici şifresini günceller.
 * Kullanıcı adı sabittir, değiştirilmez. Yeni şifre bcrypt ile hash'lenip
 * SiteContent tablosunda saklanır.
 */
export async function updateCredentials(
  currentPassword: string,
  newPassword: string,
): Promise<UpdateCredentialsResult> {
  const creds = await getStoredCredentials();

  if (!(await verifyPassword(currentPassword, creds))) {
    return { ok: false, error: 'Mevcut şifre hatalı' };
  }

  if (newPassword.length < 4) {
    return { ok: false, error: 'Yeni şifre en az 4 karakter olmalı' };
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.siteContent.upsert({
    where: { id: PASSWORD_HASH_KEY },
    update: { value: hash },
    create: { id: PASSWORD_HASH_KEY, value: hash },
  });

  return { ok: true };
}
