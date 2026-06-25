'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SearchModal } from './SearchModal';
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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 pl-24 lg:px-8 lg:pl-24">
          {/* Logo (Sol Taraf) - pl-24 ile mobildeki hamburger menüye yer bırakır */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >

            <span className="hidden font-medium tracking-wide text-white sm:block">
              {siteConfig.name}
            </span>
          </Link>

          {/* Sağ Taraf - Sadece Arama Butonu */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent border border-transparent hover:border-white/10"
              aria-label="Arama yap"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
