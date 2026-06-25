import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/data/site-config';

// Inter fontunu CSS değişkeni olarak yükle (tailwind.config.ts'te kullanılıyor).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fullTitle = `${siteConfig.title} ${siteConfig.name}`;
const description = `${siteConfig.name} — ${siteConfig.role.join(', ')}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: fullTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: fullTitle,
    description,
    images: [
      {
        // [DÜZENLE] - public/images/og-image.svg placeholder; gerçek görselle değiştirin.
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: fullTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: fullTitle,
    description,
    images: ['/images/og-image.svg'],
  },
};

// JSON-LD Person şeması — site-config'ten beslenir; '#' placeholder sosyal linkler elenir.
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: siteConfig.url,
  worksFor: {
    '@type': 'Organization',
    name: siteConfig.university,
  },
  sameAs: Object.values(siteConfig.social).filter(
    (link): boolean => (link as string) !== '#',
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-white"
        >
          İçeriğe atla
        </a>
        <Navigation />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
