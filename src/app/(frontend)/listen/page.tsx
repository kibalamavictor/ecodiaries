import type { Metadata } from 'next'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NewsletterBanner } from '@/components/layout/NewsletterBanner'
import { ListenHero } from '@/components/listen/ListenHero'
import { ListenExperience } from '@/components/listen/ListenExperience'
import { getEpisodes } from '@/lib/cms/podcasts'
import { getPodcastSeriesList } from '@/lib/cms/podcast-series'

export const metadata: Metadata = {
  title: 'Listen',
  description:
    'Interviews, community conversations, and documentary-style audio stories from the climate frontline.',
}

export default async function ListenPage() {
  const [episodes, seriesList] = await Promise.all([getEpisodes(20), getPodcastSeriesList()])
  const featured = episodes.find((e) => e.featured) || episodes[0]

  return (
    <>
      <div className="hidden md:block">
        <div className="page-head-dark">
          <SiteNav variant="light" activeLink="/listen" />
          <div className="wrap mt-32">
            <span className="eyebrow">Podcasts &amp; Audio Stories</span>
            <div className="page-head-row mt-16">
              <h1>Field notes from the climate frontline</h1>
            </div>
            <p className="lede">
              Interviews, community conversations, and documentary-style audio stories — reported from the
              places they&apos;re about.
            </p>
          </div>
        </div>
      </div>

      <ListenHero />

      <ListenExperience episodes={episodes} featured={featured} seriesList={seriesList} />

      <NewsletterBanner />
      <SiteFooter />
    </>
  )
}
