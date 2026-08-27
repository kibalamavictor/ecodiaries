import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { WatchSeriesDetail } from '@/components/watch/WatchSeriesDetail'
import { getVideoSeriesBySlug, getVideoSeriesSlugs } from '@/lib/cms/video-series'
import { buildPageMetadata } from '@/lib/seo'
import './watch-series.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getVideoSeriesSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = await getVideoSeriesBySlug(slug)
  if (!series) return { title: 'Series' }

  return buildPageMetadata({
    title: series.title,
    description: series.description || `Watch ${series.title} on EcoDiaries.`,
    path: `/watch/series/${slug}`,
  })
}

export default async function WatchSeriesPage({ params }: Props) {
  const { slug } = await params
  const series = await getVideoSeriesBySlug(slug)
  if (!series) notFound()

  return (
    <>
      <WatchSeriesDetail series={series} />
      <div className="watch-series-desktop-fallback">
        <p>This series view is optimised for mobile.</p>
        <Link href="/watch" className="btn btn-outline btn-sm">
          Back to Watch
        </Link>
      </div>
    </>
  )
}
