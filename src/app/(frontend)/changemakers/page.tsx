import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ChangemakersGrid } from '@/components/changemakers/ChangemakersGrid'
import { MagArchiveMobile } from '@/components/magazine/MagArchiveMobile'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { getChangemakers } from '@/lib/cms/organizations'
import { ORG_TYPE_FILTER_OPTIONS, filterChangemakersByType } from '@/lib/changemakers/filters'
import { changemakerToMagCard } from '@/lib/magazine'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Changemakers',
  description: 'Organisations and changemakers behind fundable climate projects across Africa.',
}

type Props = { searchParams: Promise<{ type?: string; q?: string }> }

export default async function ChangemakersPage({ searchParams }: Props) {
  const { type, q } = await searchParams
  const changemakers = await getChangemakers()
  const query = q?.trim().toLowerCase() || ''
  const visible = filterChangemakersByType(changemakers, type).filter((org) => {
    if (!query) return true
    return [org.name, org.tagline, org.hqLocation, ...(org.regions || [])].some((value) =>
      value?.toLowerCase().includes(query),
    )
  })
  const newsletterImage =
    visible[0]?.coverUrl || visible[0]?.logoUrl || 'https://picsum.photos/seed/eco-orgs/900/700'

  return (
    <MagPageShell>
      <div className="mag-section" style={{ paddingTop: 12, paddingBottom: 8 }}>
        <MagPageIntro
          eyebrow="Changemakers"
          title="Organisations powering climate solutions"
          lede="Meet the NGOs, cooperatives, and community enterprises behind projects in the Solutions Atlas."
        />
      </div>
      <section className="mag-section" style={{ paddingTop: 0 }}>
        <div className="magazine-desktop">
          <div className="mag-wrap">
            <Suspense fallback={<div className="changemakers-grid__count">Loading…</div>}>
              <ChangemakersGrid changemakers={visible} />
            </Suspense>
          </div>
        </div>
        <MagArchiveMobile
          items={visible.map(changemakerToMagCard)}
          empty="No organisations in this category yet."
          browse={{
            basePath: '/changemakers',
            paramKey: 'type',
            topics: ORG_TYPE_FILTER_OPTIONS,
            placeholder: 'Search organisations by name or place…',
            emptyLabel: 'Search changemakers or filter by type',
            searchAriaLabel: 'Search changemakers',
            dialogLabel: 'Search and filter changemakers',
          }}
        />
      </section>
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
