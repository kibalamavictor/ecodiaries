'use client'

import Link from 'next/link'
import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import type { PodcastSeriesListItem } from '@/lib/cms/podcast-series-types'
import { AudioPlayerProvider } from '@/components/listen/AudioPlayerContext'
import { FeaturedEpisodeCard } from '@/components/listen/FeaturedEpisodeCard'
import { EpisodeList } from '@/components/listen/EpisodeList'
import { ListenSeriesMobileRow } from '@/components/listen/ListenSeriesMobileRow'
import { ListenPageScroll } from '@/components/listen/ListenPageScroll'
import { FilterPills } from '@/components/ui/FilterPills'

const SERIES_BG_CLASSES = ['bg-magenta', 'bg-forest', 'bg-teal'] as const

export function ListenExperience({
  episodes,
  featured,
  seriesList,
}: {
  episodes: PodcastEpisode[]
  featured?: PodcastEpisode
  seriesList: PodcastSeriesListItem[]
}) {
  return (
    <Suspense fallback={null}>
      <ListenExperienceInner episodes={episodes} featured={featured} seriesList={seriesList} />
    </Suspense>
  )
}

function ListenExperienceInner({
  episodes,
  featured,
  seriesList,
}: {
  episodes: PodcastEpisode[]
  featured?: PodcastEpisode
  seriesList: PodcastSeriesListItem[]
}) {
  const searchParams = useSearchParams()
  const seriesFilter = searchParams.get('series') || 'all'

  const listEpisodes = featured ? episodes.filter((e) => e.id !== featured.id) : episodes

  const listenFilters = useMemo(
    () => seriesList.map((item) => ({ label: item.title, slug: item.slug })),
    [seriesList],
  )

  const filteredEpisodes = useMemo(() => {
    const base = listEpisodes.length ? listEpisodes : episodes
    if (seriesFilter === 'all') return base
    return base.filter((episode) => episode.seriesSlug === seriesFilter)
  }, [episodes, listEpisodes, seriesFilter])

  const episodeSlugs = useMemo(() => episodes.map((episode) => episode.slug), [episodes])

  return (
    <AudioPlayerProvider>
      <ListenPageScroll episodeSlugs={episodeSlugs} />
      <section className="section listen-main" id="listen-main">
        <div className="wrap">
          {featured ? <FeaturedEpisodeCard episode={featured} /> : null}

          <div className="section-head listen-recent-head mt-48">
            <h2>Recent Episodes</h2>
          </div>

          {listenFilters.length > 0 ? (
            <FilterPills
              filters={listenFilters}
              paramKey="series"
              basePath="/listen"
              modalTitle="Filter by series"
            />
          ) : null}

          <div className="listen-recent-list">
            <EpisodeList episodes={filteredEpisodes} />
          </div>
        </div>
      </section>

      <ListenSeriesMobileRow series={seriesList} />

      <section className="section on-paper listen-series-section hidden md:block" aria-label="Series Collections">
        <div className="wrap">
          <div className="section-head">
            <h2>Series Collections</h2>
          </div>
          <div className="card-grid grid-3">
            {seriesList.map((s, index) => (
              <div key={s.slug} className={`audio-tile ${SERIES_BG_CLASSES[index % SERIES_BG_CLASSES.length]}`}>
                <div>
                  <span className="audio-meta">{s.title.toUpperCase()}</span>
                  <h4 className="mt-8">{s.title}</h4>
                  <p className="mt-8" style={{ fontSize: 14, opacity: 0.85 }}>
                    {s.description}
                  </p>
                </div>
                <Link href="/listen" className="btn btn-outline btn-sm mt-16" style={{ width: 'fit-content' }}>
                  Browse series
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AudioPlayerProvider>
  )
}
