'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, ArrowRight, Layout, Shield, FileText, BookOpen, Mic } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { trainings } from '@/data/trainings';
import { publications } from '@/data/publications';

// Dynamically generate search data from real site content
const staticPages = [
  { id: 'page-home', title: 'Ana Sayfa', type: 'SAYFA', href: '/' },
  { id: 'page-about', title: 'Hakkımda', type: 'SAYFA', href: '/hakkimda' },
  { id: 'page-akademi', title: 'Akademi', type: 'SAYFA', href: '/akademi' },
  { id: 'page-basinda', title: 'Basında Biz', type: 'SAYFA', href: '/basinda-biz' },
  { id: 'page-iletisim', title: 'İletişim', type: 'SAYFA', href: '/iletisim' },
];

const trainingItems = trainings.map((t) => ({
  id: `tr-${t.slug}`,
  title: t.baslik,
  type: 'EĞİTİM',
  href: '/#egitimler',
}));

const pubItems = publications.map((p) => ({
  id: p.id,
  title: p.baslik,
  type: p.tur === 'makale' ? 'MAKALE' : p.tur === 'kitap' ? 'KİTAP' : 'BİLDİRİ',
  href: '/akademi',
}));

const searchData = [...staticPages, ...trainingItems, ...pubItems];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter data based on query
  const filteredResults = searchData.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setActiveIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[activeIndex]) {
          router.push(filteredResults[activeIndex].href);
          onClose();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, activeIndex, onClose, router]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeElement = listRef.current.children[activeIndex] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-[10%] z-[101] w-full max-w-[600px] -translate-x-1/2 px-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Modal Container */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-ink/90 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              
              {/* Search Input Area */}
              <div className="p-4 pb-2">
                <div className="flex items-center rounded-full border border-white/30 bg-white/5 px-5 py-3 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all focus-within:border-white/80 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <Search className="mr-3 h-6 w-6 text-white/50" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    placeholder="Ara: eğitim, makale, yayın, sayfa..."
                    className="w-full border-none bg-transparent text-lg text-white placeholder-white/40 outline-none focus:border-none focus:outline-none focus:ring-0"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                </div>
              </div>

              {/* Results List */}
              <div 
                ref={listRef}
                className="max-h-[60vh] overflow-y-auto py-2 px-2 custom-scrollbar"
              >
                {filteredResults.length === 0 ? (
                  <div className="p-8 text-center text-sm text-white/40">
                    Sonuç bulunamadı...
                  </div>
                ) : (
                  filteredResults.map((item, index) => {
                    const isActive = index === activeIndex;
                    
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => {
                          router.push(item.href);
                          onClose();
                        }}
                        className={cn(
                          "group relative mb-1 flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 transition-all",
                          isActive 
                            ? "bg-white/10 text-white" 
                            : "text-white/60 hover:bg-white/5"
                        )}
                      >
                        {/* Sol Kısım: İkon ve Başlık */}
                        <div className="flex items-center gap-3">
                          {item.type === 'SAYFA' && <Layout className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-white/40 group-hover:text-white/60")} />}
                          {item.type === 'EĞİTİM' && <Shield className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-white/40 group-hover:text-white/60")} />}
                          {item.type === 'MAKALE' && <FileText className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-white/40 group-hover:text-white/60")} />}
                          {item.type === 'KİTAP' && <BookOpen className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-white/40 group-hover:text-white/60")} />}
                          {item.type === 'BİLDİRİ' && <Mic className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-white/40 group-hover:text-white/60")} />}
                          
                          <span className="font-medium line-clamp-1">{item.title}</span>
                        </div>

                        {/* Sağ Kısım: Rozet ve Ok */}
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider transition-colors",
                            isActive 
                              ? "border-white/40 text-white bg-white/10" 
                              : "border-white/10 text-white/40 group-hover:border-white/20"
                          )}>
                            {item.type}
                          </span>
                          <ArrowRight className={cn(
                            "h-4 w-4 transition-transform duration-300",
                            isActive ? "text-white translate-x-1" : "text-white/20"
                          )} />
                        </div>

                        {/* Aktif olanın sağındaki kalın neon çizgi */}
                        {isActive && (
                          <div className="absolute right-0 top-0 bottom-0 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
