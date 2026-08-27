import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { CredibilityStrip } from '@/components/solutions/CredibilityStrip'
import { FundingCtaBand } from '@/components/solutions/FundingCtaBand'
import { SolutionHero } from '@/components/solutions/SolutionHero'
import { getAtlasProjects } from '@/lib/cms/solutions-page'

const SolutionsAtlasExplorer = dynamic(
  () => import('@/components/solutions/SolutionsAtlasExplorer').then((module) => module.SolutionsAtlasExplorer),
  { loading: () => <div className="py-16 text-center text-neutral-600">Loading solutions…</div> },
)

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'A living atlas of climate solutions across Africa — field-documented innovations for communities, funders, and partners.',
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SolutionsPage({ searchParams }: Props) {
  const { q } = await searchParams
  const solutions = await getAtlasProjects()
  const newsletterImage = solutions[0]?.coverImageUrl || 'https://picsum.photos/seed/eco-atlas/900/700'

  return (
    <MagPageShell>
      <SolutionHero solutions={solutions} defaultQuery={q} />
      <CredibilityStrip solutions={solutions} />
      <SolutionsAtlasExplorer projects={solutions} />
      <FundingCtaBand />
      <MagNewsletter image={newsletterImage} />
    </MagPageShell>
  )
}
