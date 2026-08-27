import Link from 'next/link'
import type { Metadata } from 'next'
import { PrintBriefButton } from '@/components/solutions/PrintBriefButton'
import { notFound } from 'next/navigation'
import { lexicalToPlainText } from '@/lib/cms/richtext'
import { getAtlasProjectBySlug } from '@/lib/cms/solutions-page'
import { SECTOR_LABELS, STATUS_LABELS } from '@/lib/solutions/types'
import { getSiteUrl } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const solution = await getAtlasProjectBySlug(slug)
  if (!solution) return { title: 'Solution brief' }
  return { title: `${solution.title} — One-pager` }
}

export default async function SolutionBriefPage({ params }: Props) {
  const { slug } = await params
  const solution = await getAtlasProjectBySlug(slug)
  if (!solution) notFound()

  const overview = solution.summary || lexicalToPlainText(solution.body)

  return (
    <div className="brief-page mx-auto max-w-3xl px-8 py-10 text-neutral-900">
      <div className="no-print mb-6 flex gap-4">
        <Link href={`/solutions/${slug}`} className="text-sm text-brand-green underline">
          ← Back to portfolio
        </Link>
        <PrintBriefButton />
      </div>

      <header className="border-b border-neutral-300 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">EcoDiaries Solutions Atlas</p>
        <h1 className="mt-2 text-3xl font-bold">{solution.title}</h1>
        <p className="mt-2 text-neutral-600">{solution.summary}</p>
        {solution.organization ? (
          <p className="mt-2 text-sm text-neutral-500">Organisation: {solution.organization.name}</p>
        ) : null}
      </header>

      <section className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold">Status</p>
          <p>{STATUS_LABELS[solution.status]}</p>
        </div>
        <div>
          <p className="font-semibold">Region</p>
          <p>{solution.locationName || solution.region}</p>
        </div>
        <div>
          <p className="font-semibold">Sectors</p>
          <p>{solution.sectors.map((s) => SECTOR_LABELS[s]).join(', ')}</p>
        </div>
        <div>
          <p className="font-semibold">Key impact</p>
          <p>{solution.keyMetric}</p>
        </div>
      </section>

      {solution.partnerOrgs?.length ? (
        <section className="mt-8">
          <p className="font-semibold">Partner organisations</p>
          <p className="mt-1 text-sm">{solution.partnerOrgs.join(' · ')}</p>
        </section>
      ) : null}

      <section className="mt-8">
        <p className="font-semibold">Overview</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{overview}</p>
      </section>

      <footer className="mt-12 border-t border-neutral-300 pt-6 text-xs text-neutral-500">
        <p>Field-documented by EcoDiaries · {getSiteUrl()}/solutions/{solution.slug}</p>
        <p className="mt-1">For partnership inquiries: hello@ecodiaries.org</p>
      </footer>
    </div>
  )
}
