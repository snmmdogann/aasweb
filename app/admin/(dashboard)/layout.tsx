import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Sidebar } from '@/components/admin/Sidebar';

/**
 * Yönetim paneli (dashboard) düzeni. Sunucu tarafında oturum doğrular; oturum
 * yoksa /admin/login'e yönlendirir. Sol sabit sidebar + sağ kaydırılabilir
 * içerik alanı sağlar. Giriş sayfası bu düzenin dışındadır.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar username={(session.username as string) ?? 'aas'} />
      <main className="min-w-0 flex-1 lg:pl-72">
        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-20 lg:px-8 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
