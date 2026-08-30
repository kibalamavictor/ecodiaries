import { unstable_cache } from 'next/cache'
import type { OpportunityType, Programme } from '@/lib/programmes/types'
import { sortProgrammes } from '@/lib/programmes/sort'
import { normalizeApplicationUrl } from '@/lib/programmes/application'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'

function mapOpportunityType(value: string | null | undefined): OpportunityType {
  if (value === 'grant' || value === 'fellowship' || value === 'event') return value
  return 'programme'
}

function mapProgramme(doc: {
  slug: string
  name: string
  description?: string | null
  cadence?: string | null
  accentColor?: string | null
  opportunityType?: string | null
  applicationInstructions?: string | null
  applicationUrl?: string | null
  applicationOpenDate?: string | null
  applicationCloseDate?: string | null
  featured?: boolean | null
  status?: ('open' | 'closed') | null
  createdAt: string
  updatedAt: string
}): Programme {
  return {
    slug: doc.slug,
    eyebrow: doc.cadence || '',
    title: doc.name,
    description: doc.description || '',
    bgClass: doc.accentColor || 'bg-forest',
    opportunityType: mapOpportunityType(doc.opportunityType),
    status: doc.status === 'closed' ? 'closed' : 'open',
    applicationInstructions: doc.applicationInstructions || '',
    applicationUrl: normalizeApplicationUrl(doc.applicationUrl),
    applicationOpenDate: doc.applicationOpenDate || null,
    applicationCloseDate: doc.applicationCloseDate || null,
    featured: Boolean(doc.featured),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

async function fetchProgrammesForPage(): Promise<Programme[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'programmes',
      sort: '-createdAt',
      limit: 100,
    })
    return sortProgrammes(result.docs.map((doc) => mapProgramme(doc)))
  } catch {
    return []
  }
}

async function fetchProgrammeBySlug(slug: string): Promise<Programme | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'programmes',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const doc = result.docs[0]
    return doc ? mapProgramme(doc) : null
  } catch {
    return null
  }
}

export function getProgrammesForPage() {
  return unstable_cache(fetchProgrammesForPage, ['programmes-page'], {
    tags: [CACHE_TAGS.programmes],
    revalidate: 60,
  })()
}

export function getProgrammeBySlug(slug: string) {
  return unstable_cache(() => fetchProgrammeBySlug(slug), ['programme', slug], {
    tags: [CACHE_TAGS.programmes, `programme:${slug}`],
    revalidate: 60,
  })()
}
