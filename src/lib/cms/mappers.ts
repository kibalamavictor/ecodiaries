import { environmentImageForKey, isGenericPlaceholder } from '@/lib/unsplash-environment'

const PLACEHOLDER = 'https://picsum.photos/seed/eco-placeholder/600/450'
const AVATAR_PLACEHOLDER = 'https://picsum.photos/seed/avatar/64/64'

type MediaDoc = { url?: string | null; alt?: string | null }
type CategoryDoc = { name?: string | null; slug?: string | null }
type ContributorDoc = { name: string; role?: string | null; profilePhoto?: number | MediaDoc | null }
type StoryDoc = {
  slug: string
  title: string
  excerpt?: string | null
  heroImage?: number | MediaDoc | null
  category?: number | CategoryDoc | null
  author?: number | ContributorDoc | null
  readingTime?: number | null
  featured?: boolean | null
  publishedAt?: string | null
  body?: unknown
}

import { lexicalToPlainText } from '@/lib/cms/richtext'

export { lexicalToPlainText }

export function resolveMediaUrl(media: number | MediaDoc | null | undefined, fallback = PLACEHOLDER): string {
  if (!media || typeof media === 'number') return fallback
  return media.url || fallback
}

export function resolveEditorialUrl(
  media: number | MediaDoc | null | undefined,
  key: string,
  width = 1600,
): string {
  const url = resolveMediaUrl(media, '')
  if (url && !isGenericPlaceholder(url)) return url
  return environmentImageForKey(key, width)
}

export function resolveMediaAlt(media: number | MediaDoc | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  const alt = media.alt?.trim()
  return alt || undefined
}

export function resolveCategoryName(category: number | CategoryDoc | null | undefined): string {
  if (!category || typeof category === 'number') return 'Climate Change'
  return category.name || 'Climate Change'
}

export function resolveCategorySlug(category: number | CategoryDoc | null | undefined): string {
  if (!category || typeof category === 'number') return 'climate-change'
  return category.slug || 'climate-change'
}

export function resolveAuthor(author: number | ContributorDoc | null | undefined) {
  if (!author || typeof author === 'number') return undefined
  return {
    name: author.name,
    role: author.role || 'Contributor',
    avatar: resolveMediaUrl(author.profilePhoto, AVATAR_PLACEHOLDER),
  }
}

export function formatReadTime(minutes?: number | null): string {
  if (!minutes) return '5 MIN READ'
  return `${minutes} MIN READ`
}

export function mapStoryCard(story: StoryDoc | Record<string, unknown>) {
  const s = story as StoryDoc
  return {
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt || undefined,
    category: resolveCategoryName(s.category),
    categorySlug: resolveCategorySlug(s.category),
    image: resolveEditorialUrl(s.heroImage, `story:${s.slug}`),
    author: resolveAuthor(s.author),
    readTime: formatReadTime(s.readingTime),
    featured: s.featured || false,
    publishedAt: s.publishedAt || undefined,
  }
}
