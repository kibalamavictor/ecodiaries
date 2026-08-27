import { resolveMediaUrl } from '@/lib/cms/mappers'
import type { Contributor, ContributorCategory } from '@/lib/contributors/types'

const ROLE_CATEGORY_RULES: { pattern: RegExp; category: ContributorCategory }[] = [
  { pattern: /photo/i, category: 'photographer' },
  { pattern: /film|video|documentar/i, category: 'filmmaker' },
  { pattern: /research/i, category: 'researcher' },
  { pattern: /poet/i, category: 'poet' },
  { pattern: /journal|writer|reporter|editor|correspondent/i, category: 'writer' },
]

function inferCategories(role?: string | null, expertiseAreas: string[] = []): ContributorCategory[] {
  const haystack = [role || '', ...expertiseAreas].join(' ').toLowerCase()
  const found = new Set<ContributorCategory>()

  for (const rule of ROLE_CATEGORY_RULES) {
    if (rule.pattern.test(haystack)) found.add(rule.category)
  }

  if (!found.size) found.add('other')
  return [...found]
}

function mapSocialLinks(
  links?: { platform?: string | null; url?: string | null }[] | null,
): Contributor['links'] {
  if (!links?.length) return undefined
  const out: NonNullable<Contributor['links']> = {}
  for (const link of links) {
    if (!link.url) continue
    const platform = (link.platform || '').toLowerCase()
    if (platform.includes('instagram')) out.instagram = link.url
    else if (platform.includes('twitter') || platform === 'x') out.twitter = link.url
    else if (platform.includes('mail') || link.url.startsWith('mailto:')) out.email = link.url.replace('mailto:', '')
    else out.website = link.url
  }
  return Object.keys(out).length ? out : undefined
}

export function mapContributorFromCms(doc: {
  id: string | number
  name: string
  slug?: string | null
  role?: string | null
  bio?: string | null
  profilePhoto?: unknown
  expertise?: { area?: string | null }[] | null
  socialLinks?: { platform?: string | null; url?: string | null }[] | null
  email?: string
  region?: string | null
}): Contributor {
  const expertiseAreas =
    doc.expertise?.map((e) => e.area).filter((a): a is string => Boolean(a)) ?? []
  const categories = inferCategories(doc.role, expertiseAreas)
  const avatarUrl = resolveMediaUrl(doc.profilePhoto as never, '')

  return {
    id: String(doc.id),
    name: doc.name,
    avatarUrl: avatarUrl || null,
    categories,
    primaryRole: doc.role || categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' · '),
    bio: doc.bio || expertiseAreas.join(' · ') || 'EcoDiaries contributor',
    region: doc.region || undefined,
    links: {
      ...mapSocialLinks(doc.socialLinks),
      ...(doc.email ? { email: doc.email } : {}),
    },
  }
}
