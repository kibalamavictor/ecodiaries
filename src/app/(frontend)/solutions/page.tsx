import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { SiteFooter } from '@/components/layout/SiteFooter'
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

  return (
    <div className="solutions-page">
      <SolutionHero solutions={solutions} defaultQuery={q} />
      <div className="hidden md:block">
        <CredibilityStrip solutions={solutions} />
      </div>
      <SolutionsAtlasExplorer projects={solutions} />
      <div className="hidden md:block">
        <FundingCtaBand />
      </div>
      <SiteFooter />
    </div>
  )
}
