export const ORG_TYPE_FILTER_OPTIONS = [
  { label: 'All', slug: 'all' },
  { label: 'NGO', slug: 'ngo' },
  { label: 'Cooperative', slug: 'cooperative' },
  { label: 'Social enterprise', slug: 'social-enterprise' },
  { label: 'Research', slug: 'research' },
  { label: 'Community', slug: 'community' },
  { label: 'Government', slug: 'government' },
] as const

export const ORG_TYPE_SLUGS = new Set<string>(ORG_TYPE_FILTER_OPTIONS.map((option) => option.slug))

export function filterChangemakersByType<T extends { type: string }>(
  changemakers: T[],
  typeSlug?: string | null,
): T[] {
  if (!typeSlug || typeSlug === 'all' || !ORG_TYPE_SLUGS.has(typeSlug)) return changemakers
  return changemakers.filter((org) => org.type === typeSlug)
}
