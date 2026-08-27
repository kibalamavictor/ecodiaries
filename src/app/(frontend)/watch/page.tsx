import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { WatchExperience } from '@/components/watch/WatchExperience'
import { getVideos } from '@/lib/cms/videos'
import { getVideoSeriesList } from '@/lib/cms/video-series'

export const metadata: Metadata = {
  title: 'Watch',
  description:
    'Documentaries, field reports, interviews, and community spotlights — the visual side of EcoDiaries reporting.',
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function WatchPage({ searchParams }: Props) {
  await searchParams
  const [videos, seriesList] = await Promise.all([getVideos(), getVideoSeriesList()])
  const featured = videos.find((v) => v.featured) || videos.find((v) => v.playback) || videos[0]

  return (
    <>
      <Suspense fallback={null}>
        <WatchExperience videos={videos} seriesList={seriesList} initialSlug={featured?.slug} />
      </Suspense>
      <NewsletterBanner />
      <SiteFooter />
    </>
  )
}
