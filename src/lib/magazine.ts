import { uniquifyEditorialImages } from '@/lib/unsplash-environment'
import type { MagCardItem } from '@/components/magazine/MagCard'
import { ORG_TYPE_FILTER_OPTIONS } from '@/lib/changemakers/filters'
import type { Contributor } from '@/lib/contributors/types'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { opportunityDetailPath } from '@/lib/programmes/routes'
import { OPPORTUNITY_TYPE_LABELS, type OpportunityType } from '@/lib/programmes/types'
import {
  SECTOR_FILTER_OPTIONS,
  SECTOR_LABELS,
  type AtlasProject,
  type Sector,
} from '@/lib/solutions/types'

export function magCardKey(item: MagCardItem): string {
  return item.id || `${item.href}::${item.title}`
}

export function uniquifyMagCards(items: MagCardItem[]): MagCardItem[] {
  return uniquifyEditorialImages(
    items,
    (item) => magCardKey(item),
    (item) => item.image,
    (item, image) => ({ ...item, image }),
  )
}

export function formatMagDate(iso?: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function sectorLabel(sector?: Sector | string): string {
  if (!sector) return 'Solutions'
  const match = SECTOR_FILTER_OPTIONS.find((option) => option.value === sector)
  return match?.label || String(sector).replace(/-/g, ' ')
}

export function byline(name?: string, date?: string): string {
  const who = name || ''
  if (who && date) return `${who} · ${date}`
  return who || date || ''
}

export function atlasProjectToMagCard(project: AtlasProject): MagCardItem {
  return {
    id: project.id || project.slug,
    href: `/solutions/${project.slug}`,
    image: project.coverImageUrl,
    category: project.sectors[0] ? SECTOR_LABELS[project.sectors[0]] : 'Solutions',
    title: project.title,
    excerpt: project.summary,
    byline: [project.organization?.name, project.region].filter(Boolean).join(' · '),
  }
}

export function contributorToMagCard(contributor: Contributor): MagCardItem {
  return {
    id: contributor.id,
    href: '/contributors',
    image: contributor.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(contributor.id)}/800/600`,
    category: contributor.primaryRole || 'Contributor',
    title: contributor.name,
    excerpt: contributor.bio,
    byline: contributor.region,
  }
}

export function communityProjectToMagCard(project: {
  title: string
  excerpt: string
  image: string
}): MagCardItem {
  return {
    id: project.title,
    href: '/community',
    image: project.image,
    category: 'Community',
    title: project.title,
    excerpt: project.excerpt,
  }
}

export function programmeToMagCard(programme: {
  slug: string
  title: string
  description?: string
  eyebrow?: string
  opportunityType?: OpportunityType
}): MagCardItem {
  return {
    id: programme.slug,
    href: opportunityDetailPath(programme.slug),
    image: getProgrammeImageUrl(programme.slug),
    category:
      programme.eyebrow ||
      (programme.opportunityType ? OPPORTUNITY_TYPE_LABELS[programme.opportunityType] : 'Opportunity'),
    title: programme.title,
    excerpt: programme.description,
  }
}

export function changemakerToMagCard(org: {
  slug: string
  name: string
  type: string
  tagline?: string
  coverUrl?: string
  logoUrl?: string
  hqLocation?: string
  regions?: string[]
}): MagCardItem {
  const typeLabel = ORG_TYPE_FILTER_OPTIONS.find((option) => option.slug === org.type)?.label || org.type
  return {
    id: org.slug,
    href: `/changemakers/${org.slug}`,
    image: org.coverUrl || org.logoUrl || `https://picsum.photos/seed/${encodeURIComponent(org.slug)}/800/600`,
    category: typeLabel,
    title: org.name,
    excerpt: org.tagline,
    byline: org.hqLocation || org.regions?.[0],
  }
}
