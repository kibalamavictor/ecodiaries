import type { Metadata } from 'next'
import { resolveMediaUrl } from '@/lib/cms/mappers'

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SERVER_URL || 'https://ecodiaries-platform.vercel.app').replace(/\/$/, '')
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

type PageMetaInput = {
  title: string
  description?: string | null
  path: string
  imageUrl?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  authors?: string[]
}

export function buildPageMetadata({
  title,
  description,
  path,
  imageUrl,
  type = 'website',
  publishedTime,
  authors,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path)
  const desc =
    description ||
    'EcoDiaries documents African climate solutions and community stories — from farms and forests to youth-led energy access.'
  const ogImage =
    imageUrl ||
    absoluteUrl(`/api/og?title=${encodeURIComponent(title)}&type=${encodeURIComponent(type === 'article' ? 'Story' : 'EcoDiaries')}`)

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: 'EcoDiaries',
      type,
      ...(publishedTime && type === 'article' ? { publishedTime } : {}),
      ...(authors?.length ? { authors } : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImage],
    },
  }
}

export function resolveOgImage(
  customOg: unknown,
  heroImage: unknown,
  fallbackTitle: string,
  category?: string,
): string {
  const custom = resolveMediaUrl(customOg as never, '')
  if (custom && !custom.includes('picsum.photos')) return custom
  const hero = resolveMediaUrl(heroImage as never, '')
  if (hero && !hero.includes('picsum.photos')) return hero
  const params = new URLSearchParams({ title: fallbackTitle })
  if (category) params.set('category', category)
  return absoluteUrl(`/api/og?${params.toString()}`)
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EcoDiaries',
  url: getSiteUrl(),
  logo: absoluteUrl('/logo.svg'),
  description:
    'Climate storytelling platform documenting environmental action, resilience, and innovation across Africa.',
  email: 'hello@ecodiaries.org',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kampala',
    addressCountry: 'UG',
  },
}
