import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MagPageShell } from '@/components/magazine/MagPageShell'
import { ProgrammeDetail } from '@/components/programmes/ProgrammeDetail'
import { getProgrammeBySlug, getProgrammesForPage } from '@/lib/cms/programmes-page'
import { opportunityDetailPath } from '@/lib/programmes/routes'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const programmes = await getProgrammesForPage()
  return programmes.map((programme) => ({ slug: programme.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const programme = await getProgrammeBySlug(slug)
  if (!programme) return { title: 'Opportunity' }

  return buildPageMetadata({
    title: programme.title,
    description: programme.description || `Learn more about ${programme.title} on EcoDiaries.`,
    path: opportunityDetailPath(slug),
  })
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { slug } = await params
  const programme = await getProgrammeBySlug(slug)
  if (!programme) notFound()

  return (
    <MagPageShell>
      <ProgrammeDetail programme={programme} />
    </MagPageShell>
  )
}
