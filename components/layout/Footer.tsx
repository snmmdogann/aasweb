import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { Linkedin, Instagram, GraduationCap, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#0b192c]/40 backdrop-blur-lg pt-16 pb-8 text-white/70">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Logo & About */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white tracking-wide">
              {siteConfig.title} {siteConfig.name}
            </h3>
            <p className="text-sm leading-relaxed text-white/60 pr-4">
              Akademik derinliği sahadaki siber güvenlik tecrübesiyle birleştiriyorum.
              Güvenli dijital yarınlar için araştırma, eğitim ve danışmanlık hizmetleri.
            </p>
            <div className="mt-4 flex gap-4">
              <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:-translate-y-1 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:-translate-y-1 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href={siteConfig.social.scholar} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:-translate-y-1 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <GraduationCap className="h-5 w-5" />
                <span className="sr-only">Google Scholar</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Hızlı Bağlantılar</h4>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="/hakkimda" className="w-fit hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">Hakkımda</Link>
              <Link href="/akademi" className="w-fit hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">Akademi & Yayınlar</Link>
              <Link href="/#egitimler" className="w-fit hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">Kurumsal Eğitimler</Link>
              <Link href="/basinda-biz" className="w-fit hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">Basında Biz</Link>
              <Link href="/iletisim" className="w-fit hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">İletişim</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">İletişim Bilgileri</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href={`mailto:${siteConfig.email}`} className="group flex w-fit items-center gap-3 hover:text-white transition-all">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-all group-hover:bg-white/10 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <Mail className="h-4 w-4" />
                </div>
                {siteConfig.email}
              </a>
              <div className="mt-2 text-white/50 leading-relaxed">
                <p className="font-medium text-white/70">{siteConfig.university}</p>
                <p>{siteConfig.department}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {currentYear} {siteConfig.title} {siteConfig.name}. Tüm Hakları Saklıdır.</p>
          <div className="flex items-center gap-2 tracking-wider uppercase">
            <span>Powered by</span>
            <a 
              href={siteConfig.verkosisUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="font-bold text-white transition-all hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
            >
              VERKOSIS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
