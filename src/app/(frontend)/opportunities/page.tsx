import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MagArchiveMobile } from '@/components/magazine/MagArchiveMobile'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { ProgrammeHero } from '@/components/programmes/ProgrammeHero'
import { ProgrammesPageGrid } from '@/components/programmes/ProgrammesPageGrid'
import { ProgrammesPageHowItWorks } from '@/components/programmes/ProgrammesPageHowItWorks'
import { getProgrammesForPage } from '@/lib/cms/programmes-page'
import { PROGRAMME_TYPE_FILTERS } from '@/lib/programmes/filters'
import { prepareProgrammesList } from '@/lib/programmes/list'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'
import { getProgrammeImageUrl } from '@/lib/programmes/images'
import { programmeToMagCard } from '@/lib/magazine'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const programmes = await getProgrammesForPage()
  const names = programmes.map((p) => p.title).slice(0, 3).join(', ')
  return buildPageMetadata({
    title: 'Opportunities',
    description: names
      ? `Climate programmes, grants, fellowships, and events — including ${names}, and more.`
      : 'Climate programmes, grants, fellowships, and events for storytellers, journalists, and community reporters across Africa.',
    path: OPPORTUNITIES_PATH,
  })
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; age?: string }>
}) {
  const { q, type, age } = await searchParams
  const programmes = await getProgrammesForPage()
  const newsletterImage = getProgrammeImageUrl(programmes[0]?.slug || 'opportunities', 900, 700)
  const visible = prepareProgrammesList(programmes, type || 'all', age || 'all', q)

  return (
    <MagPageShell>
      <ProgrammeHero defaultQuery={q} />
      <div className="magazine-desktop">
        <Suspense fallback={<div className="py-16 text-center text-neutral-600">Loading opportunities…</div>}>
          <ProgrammesPageGrid programmes={programmes} />
        </Suspense>
      </div>
      <MagArchiveMobile
        items={visible.map(programmeToMagCard)}
        empty="No opportunities match these filters yet."
        browse={{
          basePath: OPPORTUNITIES_PATH,
          paramKey: 'type',
          topics: PROGRAMME_TYPE_FILTERS,
          placeholder: 'Search programmes, grants, fellowships…',
          emptyLabel: 'Search opportunities or filter by type',
          searchAriaLabel: 'Search opportunities',
          dialogLabel: 'Search and filter opportunities',
        }}
      />
      <ProgrammesPageHowItWorks />
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
