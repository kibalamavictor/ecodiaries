import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { ProgrammeHero } from '@/components/programmes/ProgrammeHero'
import { ProgrammesPageGrid } from '@/components/programmes/ProgrammesPageGrid'
import { ProgrammesPageHowItWorks } from '@/components/programmes/ProgrammesPageHowItWorks'
import { getProgrammesForPage } from '@/lib/cms/programmes-page'
import { OPPORTUNITIES_PATH } from '@/lib/programmes/routes'
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
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const programmes = await getProgrammesForPage()

  return (
    <div className="programmes-page">
      <ProgrammeHero defaultQuery={q} />

      <Suspense fallback={<div className="py-16 text-center text-neutral-600">Loading opportunities…</div>}>
        <ProgrammesPageGrid programmes={programmes} />
      </Suspense>

      <ProgrammesPageHowItWorks />

      <NewsletterBanner />
      <SiteFooter />
    </div>
  )
}
