import type { Metadata } from 'next';
import { ToastProvider } from '@/components/admin/ToastProvider';

export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: { index: false, follow: false },
};

/**
 * Tüm /admin sayfalarını saran kök düzen. Toast sağlayıcı burada; böylece hem
 * giriş sayfası hem de (dashboard) grubu bildirim gösterebilir. Oturum kontrolü
 * middleware + (dashboard) düzeninde yapılır.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0a0f1e] text-white antialiased">
        {children}
      </div>
    </ToastProvider>
  );
}
