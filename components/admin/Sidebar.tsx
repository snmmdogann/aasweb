'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Ana Sayfa', Icon: LayoutDashboard },
  { href: '/admin/yayinlar', label: 'Yayınlar', Icon: BookOpen },
  { href: '/admin/basin', label: 'Basın & Medya', Icon: Newspaper },
  { href: '/admin/site-icerigi', label: 'Site İçeriği', Icon: FileText },
];

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      // Çıkıştan sonra yönetici paneli yerine herkese açık siteye dön.
      router.replace('/');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const NavContent = (
    <>
      {/* Logo / avatar alanı — hocanın ana sayfadaki portresi */}
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-ice text-lg font-bold text-white shadow-lg">
          <Image
            src="/images/press/aas.jpeg"
            alt="Dr. Ahmet Ali Süzen"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            Dr. Süzen
          </p>
          <p className="truncate text-xs text-white/40">@{username}</p>
        </div>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:bg-white/5 hover:text-white',
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary-light to-ice"
                />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="h-5 w-5 shrink-0" />
          Siteyi Görüntüle
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300/80 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5 shrink-0" />
          )}
          Çıkış Yap
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobil üst bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0a0f1e]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <span className="font-semibold text-white">Yönetim Paneli</span>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menüyü aç"
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Masaüstü sabit sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-[#0b1124] px-4 py-4 lg:flex">
        {NavContent}
      </aside>

      {/* Mobil off-canvas sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0b1124] px-4 py-4 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Menüyü kapat"
                className="absolute right-3 top-3 rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {NavContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
