'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Presentation,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import type { Publication, PublicationType } from '@/data/publications';
import { cn } from '@/lib/utils';

/* ── Sabit ── */
const ITEMS_PER_PAGE = 3; // Her sayfada 3 yayın (sol + sağ = 6)

/* ── Tür bazlı ikon ve renk ── */
const iconByType: Record<PublicationType, LucideIcon> = {
  makale: FileText,
  bildiri: Presentation,
  kitap: BookOpen,
};

const coverGradients: Record<PublicationType, string> = {
  makale: 'linear-gradient(145deg, #182F57 0%, #1B4661 40%, #19454B 100%)',
  bildiri: 'linear-gradient(145deg, #19454B 0%, #1B6156 40%, #18573B 100%)',
  kitap: 'linear-gradient(145deg, #1B4661 0%, #182F57 40%, #19454B 100%)',
};

const spineColors: Record<PublicationType, string> = {
  makale: '#12243F',
  bildiri: '#133B3A',
  kitap: '#14324A',
};

/* ── Tek yayın satırı ── */
function PubItem({ pub }: { pub: Publication }) {
  return (
    <li className="border-b border-stone-300/40 pb-2.5 last:border-b-0 last:pb-0">
      <p className="text-[13px] font-semibold leading-snug text-stone-800">
        {pub.baslik}
      </p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500">
        {pub.yazarlar}
      </p>
      <p className="mt-0.5 text-[11px] text-stone-400">
        {pub.dergiVeyaKonferans} · {pub.yil}
      </p>
      {pub.doiUrl && (
        <a
          href={pub.doiUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md"
        >
          İncele
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}

/**
 * 3D kitap kartı: Tıklayınca açık kitap olarak (2 sayfa yan yana)
 * gösterilir. Sayfalar arasında çevirme animasyonu ile geçiş yapılır.
 */
export function BookCard({
  tur,
  label,
  items,
}: {
  tur: PublicationType;
  label: string;
  items: Publication[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0); // her spread = 2 sayfa (sol+sağ)
  const [flipDirection, setFlipDirection] = useState(1);

  const Icon = iconByType[tur];
  const totalSpreads = Math.ceil(items.length / (ITEMS_PER_PAGE * 2));

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setCurrentSpread(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setCurrentSpread(0);
    document.body.style.overflow = '';
  }, []);

  const nextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1) {
      setFlipDirection(1);
      setCurrentSpread((s) => s + 1);
    }
  }, [currentSpread, totalSpreads]);

  const prevSpread = useCallback(() => {
    if (currentSpread > 0) {
      setFlipDirection(-1);
      setCurrentSpread((s) => s - 1);
    }
  }, [currentSpread]);

  // Escape ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) handleClose();
      if (e.key === 'ArrowRight' && isExpanded) nextSpread();
      if (e.key === 'ArrowLeft' && isExpanded) prevSpread();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded, handleClose, nextSpread, prevSpread]);

  // Şu anki spread için sol ve sağ sayfa yayınlarını hesapla
  const spreadStart = currentSpread * ITEMS_PER_PAGE * 2;
  const leftPageItems = items.slice(spreadStart, spreadStart + ITEMS_PER_PAGE);
  const rightPageItems = items.slice(spreadStart + ITEMS_PER_PAGE, spreadStart + ITEMS_PER_PAGE * 2);

  // Sayfa flip animasyonu
  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <>
      {/* ─── Kapalı kitap (grid içinde) ─── */}
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleExpand()}
        aria-label={`${label} kitabını aç`}
      >
        <div className="book-perspective mx-auto w-[200px] h-[280px] sm:w-[220px] sm:h-[300px]">
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {/* Kitap arka sayfaları (pages edge) */}
            <div
              className="absolute inset-0 rounded-r-md"
              style={{
                background: 'linear-gradient(90deg, #f5f0e8 0%, #ebe5d9 30%, #f0ebe2 100%)',
                transform: 'translateZ(-4px)',
                borderRight: '3px solid #d4cfc4',
                boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.08)',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute right-0"
                  style={{
                    top: `${12 + i * 14}%`,
                    width: '85%',
                    height: '1px',
                    background: `rgba(0,0,0,${0.04 + i * 0.005})`,
                  }}
                />
              ))}
            </div>

            {/* Spine (sırt) */}
            <div
              className="absolute left-0 top-0 h-full w-[14px] rounded-l-md"
              style={{
                background: spineColors[tur],
                boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.3), 2px 0 4px rgba(0,0,0,0.15)',
                transform: 'translateZ(2px)',
              }}
            />

            {/* Ön kapak */}
            <div
              className={cn(
                'book-cover absolute inset-0 rounded-r-md rounded-l-sm flex flex-col items-center justify-center p-6 transition-all duration-700',
                isHovered && 'book-cover-open'
              )}
              style={{
                background: coverGradients[tur],
                transformStyle: 'preserve-3d',
                zIndex: 2,
              }}
            >
              {/* Kapak dokusu */}
              <div
                className="absolute inset-0 rounded-r-md rounded-l-sm pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                }}
              />

              {/* Kapak kenar çizgisi */}
              <div
                className="absolute top-3 left-5 right-3 bottom-3 rounded border border-white/10 pointer-events-none"
              />

              {/* İkon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Icon className="h-8 w-8 text-white/90" aria-hidden="true" />
              </div>

              {/* Başlık */}
              <h3 className="text-center text-lg font-bold text-white tracking-wide">
                {label}
              </h3>

              {/* Yayın sayısı */}
              <span className="mt-2 text-sm text-white/60 font-medium">
                {items.length} yayın
              </span>

              {/* Alt dekorasyon */}
              <div className="mt-4 h-[1px] w-16 bg-white/20" />
              <span className="mt-2 text-xs text-white/40 italic">
                Keşfetmek için tıkla
              </span>
            </div>

            {/* Gölge */}
            <div
              className="absolute -bottom-3 left-4 right-2 h-6 rounded-full opacity-40 blur-md transition-all duration-500"
              style={{
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
                transform: isHovered ? 'scaleX(1.1) translateY(4px)' : 'scaleX(1)',
              }}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
          className="mt-4 text-center text-sm text-white/50"
        >
          Açmak için tıklayın
        </motion.p>
      </div>

      {/* ─── Açık kitap (2 sayfa yan yana — gerçek kitap görünümü) ─── */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="book-overlay fixed inset-0 z-50"
              onClick={handleClose}
            />

            {/* Açık kitap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotateX: 20 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 24,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              style={{ perspective: '1800px' }}
            >
              <div className="pointer-events-auto relative w-full max-w-[900px]">
                {/* Kapat butonu */}
                <button
                  onClick={handleClose}
                  className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white/80 backdrop-blur-sm transition-all hover:bg-white/25 hover:text-white hover:scale-110 z-10"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Kitap gövdesi */}
                <div
                  className="relative flex rounded-xl overflow-hidden book-shadow-open"
                  style={{ minHeight: '520px' }}
                >
                  {/* ── Kitap sırtı (orta spine) ── */}
                  <div
                    className="absolute left-1/2 top-0 bottom-0 w-[20px] -translate-x-1/2 z-20"
                    style={{
                      background: `linear-gradient(90deg, 
                        rgba(0,0,0,0.15) 0%, 
                        ${spineColors[tur]} 30%, 
                        ${spineColors[tur]} 70%, 
                        rgba(0,0,0,0.15) 100%)`,
                      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Spine dekorasyon çizgileri */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-[calc(100%-32px)] bg-white/10" />
                  </div>

                  {/* ── Sol sayfa ── */}
                  <div
                    className="relative flex-1 flex flex-col"
                    style={{
                      background: 'linear-gradient(135deg, #faf7f0 0%, #f5f0e6 50%, #f0ebe0 100%)',
                      borderRadius: '12px 0 0 12px',
                    }}
                  >
                    {/* Sol üst kapak şeridi */}
                    <div
                      className="h-1.5 w-full rounded-tl-xl"
                      style={{ background: coverGradients[tur] }}
                    />

                    {/* Sol başlık */}
                    <div className="flex items-center gap-2.5 border-b border-stone-200/80 px-5 py-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-md"
                        style={{ background: coverGradients[tur] }}
                      >
                        <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-800">{label}</h3>
                        <p className="text-xs text-stone-400">
                          Sayfa {currentSpread * 2 + 1}
                        </p>
                      </div>
                    </div>

                    {/* Sol içerik — animasyonlu */}
                    <div className="flex-1 overflow-y-auto px-5 py-3 pr-6" style={{ perspective: '1000px' }}>
                      <AnimatePresence mode="wait" custom={flipDirection}>
                        <motion.div
                          key={`left-${currentSpread}`}
                          custom={flipDirection}
                          variants={pageVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                          style={{ transformOrigin: 'right center' }}
                        >
                          <ul className="flex flex-col gap-3">
                            {leftPageItems.map((pub) => (
                              <PubItem key={pub.id} pub={pub} />
                            ))}
                          </ul>
                          {leftPageItems.length === 0 && (
                            <p className="text-sm text-stone-400 italic text-center py-10">
                              Bu sayfada yayın bulunmuyor.
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Sol sayfa numarası */}
                    <div className="border-t border-stone-200/60 px-5 py-2 text-center text-xs text-stone-400 italic">
                      — {currentSpread * 2 + 1} —
                    </div>

                    {/* Kâğıt dokusu */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-l-xl opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>

                  {/* ── Sağ sayfa ── */}
                  <div
                    className="relative flex-1 flex flex-col"
                    style={{
                      background: 'linear-gradient(225deg, #faf7f0 0%, #f5f0e6 50%, #f0ebe0 100%)',
                      borderRadius: '0 12px 12px 0',
                    }}
                  >
                    {/* Sağ üst kapak şeridi */}
                    <div
                      className="h-1.5 w-full rounded-tr-xl"
                      style={{ background: coverGradients[tur] }}
                    />

                    {/* Sağ başlık */}
                    <div className="flex items-center justify-between border-b border-stone-200/80 px-5 py-3">
                      <p className="text-xs text-stone-400">
                        Sayfa {currentSpread * 2 + 2} · Toplam {items.length} yayın
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        {currentSpread + 1} / {totalSpreads}
                      </div>
                    </div>

                    {/* Sağ içerik — animasyonlu */}
                    <div className="flex-1 overflow-y-auto px-5 py-3 pl-6" style={{ perspective: '1000px' }}>
                      <AnimatePresence mode="wait" custom={flipDirection}>
                        <motion.div
                          key={`right-${currentSpread}`}
                          custom={flipDirection}
                          variants={pageVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
                          style={{ transformOrigin: 'left center' }}
                        >
                          <ul className="flex flex-col gap-3">
                            {rightPageItems.map((pub) => (
                              <PubItem key={pub.id} pub={pub} />
                            ))}
                          </ul>
                          {rightPageItems.length === 0 && (
                            <p className="text-sm text-stone-400 italic text-center py-10">
                              —
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Sağ sayfa numarası */}
                    <div className="border-t border-stone-200/60 px-5 py-2 text-center text-xs text-stone-400 italic">
                      — {currentSpread * 2 + 2} —
                    </div>

                    {/* Kâğıt dokusu */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-r-xl opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                </div>

                {/* ── Sayfa çevirme navigasyonu ── */}
                <div className="mt-5 flex items-center justify-center gap-4">
                  <button
                    onClick={prevSpread}
                    disabled={currentSpread === 0}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-200',
                      currentSpread === 0
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Önceki
                  </button>

                  {/* Sayfa göstergeleri */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalSpreads }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setFlipDirection(i > currentSpread ? 1 : -1);
                          setCurrentSpread(i);
                        }}
                        className={cn(
                          'rounded-full transition-all duration-300',
                          i === currentSpread
                            ? 'h-3 w-8 bg-white/80'
                            : 'h-2.5 w-2.5 bg-white/25 hover:bg-white/50'
                        )}
                        aria-label={`Sayfa ${i * 2 + 1}-${i * 2 + 2}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSpread}
                    disabled={currentSpread === totalSpreads - 1}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-200',
                      currentSpread === totalSpreads - 1
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
                    )}
                  >
                    Sonraki
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
