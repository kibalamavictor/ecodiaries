import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ListenSeriesDetail } from '@/components/listen/ListenSeriesDetail'
import { getPodcastSeriesBySlug, getPodcastSeriesSlugs } from '@/lib/cms/podcast-series'
import { buildPageMetadata } from '@/lib/seo'
import './listen-series.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getPodcastSeriesSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = await getPodcastSeriesBySlug(slug)
  if (!series) return { title: 'Series' }

  return buildPageMetadata({
    title: series.title,
    description: series.description || `Listen to ${series.title} on EcoDiaries.`,
    path: `/listen/series/${slug}`,
  })
}

export default async function ListenSeriesPage({ params }: Props) {
  const { slug } = await params
  const series = await getPodcastSeriesBySlug(slug)
  if (!series) notFound()

  return (
    <>
      <ListenSeriesDetail series={series} />
      <div className="listen-series-desktop-fallback">
        <p>This series view is optimised for mobile.</p>
        <Link href="/listen" className="btn btn-outline btn-sm">
          Back to Listen
        </Link>
      </div>
    </>
  )
}
