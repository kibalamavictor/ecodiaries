import type { MetadataRoute } from 'next'
import { getSitemapEntries } from '@/lib/cms/sitemap-data'
import { getSiteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const { stories, solutions, programmes } = await getSitemapEntries()

  const staticPages = [
    '',
    '/about',
    '/stories',
    '/solutions',
    '/watch',
    '/listen',
    '/community',
    '/contributors',
    '/opportunities',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
  ]

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...stories.map((s) => ({
      url: `${base}/stories/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...solutions.map((s) => ({
      url: `${base}/solutions/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...programmes.map((p) => ({
      url: `${base}/opportunities/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
