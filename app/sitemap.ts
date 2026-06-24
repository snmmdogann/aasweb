import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site-config';

const routes = ['', '/hakkimda', '/akademi', '/basinda-biz', '/iletisim'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
