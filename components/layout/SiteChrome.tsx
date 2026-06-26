'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

/**
 * Genel site başlığı (Navigation) ve alt bilgisi (Footer), yalnızca herkese açık
 * sayfalarda gösterilir. /admin altındaki yönetim paneli kendi düzenini kullandığı
 * için bu bileşenler orada gizlenir.
 */
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Navigation />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Footer />;
}
