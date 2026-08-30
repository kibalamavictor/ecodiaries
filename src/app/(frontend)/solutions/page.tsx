import type { Metadata } from 'next'
import { MagCtaBand } from '@/components/magazine/MagCtaBand'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { CredibilityStrip } from '@/components/solutions/CredibilityStrip'
import { SolutionHero } from '@/components/solutions/SolutionHero'
import { SolutionsAtlasHero } from '@/components/solutions/atlas/SolutionsAtlasHero'
import { MagSolutionsMobileFeed } from '@/components/magazine/MagSolutionsMobileFeed'
import { SolutionsCollections } from '@/components/solutions/SolutionsCollections'
import { SolutionsToolbar } from '@/components/solutions/SolutionsToolbar'
import { getAtlasProjects } from '@/lib/cms/solutions-page'
import { environmentImageForKey } from '@/lib/unsplash-environment'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'A living atlas of climate solutions across Africa — field-documented innovations for communities, funders, and partners.',
}

type Props = { searchParams: Promise<{ q?: string; sector?: string; category?: string }> }

export default async function SolutionsPage({ searchParams }: Props) {
  const { q, sector, category } = await searchParams
  const solutions = await getAtlasProjects()
  const newsletterImage = solutions[0]?.coverImageUrl || environmentImageForKey('solutions-newsletter')
  const activeSector = sector || category

  return (
    <MagPageShell>
      <div className="mag-wrap solutions-hero">
        <div className="solutions-hero__grid">
          <SolutionHero stacked />
          <SolutionsAtlasHero projects={solutions} />
        </div>
        <CredibilityStrip solutions={solutions} />
        <div className="magazine-desktop">
          <SolutionsToolbar defaultQuery={q} />
        </div>
      </div>
      <div className="magazine-desktop">
        <SolutionsCollections projects={solutions} query={q} sector={activeSector} />
      </div>
      <MagSolutionsMobileFeed projects={solutions} query={q} sector={activeSector} />
      <MagCtaBand
        eyebrow="For funders & partners"
        title="Partner with us to scale what’s working"
        lede="Field-documented, community-rooted solutions ready for support across Africa."
        href="/contact?reason=partnership"
        label="Start a conversation"
      />
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
