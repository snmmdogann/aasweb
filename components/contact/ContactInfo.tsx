import { Instagram, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '@/data/site-config';

const socialItems = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: 'Instagram', href: siteConfig.social.instagram, Icon: Instagram },
];

/**
 * İletişim sayfasının yanında yer alan resmi e-posta ve sosyal medya bağlantıları.
 */
export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-primary-dark">E-posta</h2>
        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-2 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-dark"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          {siteConfig.email}
        </a>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-primary-dark">Sosyal Medya</h2>
        <div className="mt-3 flex gap-3">
          {socialItems.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink/10 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
