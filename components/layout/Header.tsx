'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SearchModal } from './SearchModal';
import { AdminMenu } from './AdminMenu';
import { siteConfig } from '@/data/site-config';

const navLinks = [
  { href: '/', label: 'Anasayfa' },
  { href: '/hakkimda', label: 'Hakkımda' },
  { href: '/akademi', label: 'Akademi' },
  { href: '/basinda-biz', label: 'Basın ve Medya' },
  { href: '/iletisim', label: 'İletişim' },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
          scrolled ? 'bg-primary-dark/80 py-4 backdrop-blur-md shadow-sm border-b border-white/10' : 'bg-transparent py-6',
        )}
      >
        <div className="relative flex w-full items-center px-6 lg:px-8">
          {/* Logo — menü simgesinin yanında */}
          <Link
            href="/"
            className="absolute left-20 top-1/2 -translate-y-1/2 group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >

            <span className="hidden font-medium tracking-wide text-white sm:block">
              {siteConfig.name}
            </span>
          </Link>

          {/* Spacer — arama butonunu sağa iter */}
          <div className="ml-auto"></div>

          {/* Sağ Taraf - Arama ve Yönetici Butonları */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent border border-transparent hover:border-white/10"
              aria-label="Arama yap"
            >
              <Search className="h-5 w-5" />
            </button>
            <AdminMenu />
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
