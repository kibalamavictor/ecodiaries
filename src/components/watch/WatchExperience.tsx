'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { PlayIcon } from '@/components/icons'
import { FilterPills } from '@/components/ui/FilterPills'
import { FeaturedVideoPlayer } from '@/components/watch/FeaturedVideoPlayer'
import { WatchHero } from '@/components/watch/WatchHero'
import { WatchMoreVideos } from '@/components/watch/WatchMoreVideos'
import { WatchSeriesMobileRow } from '@/components/watch/WatchSeriesMobileRow'
import { WATCH_CATEGORIES, type WatchVideoItem } from '@/lib/cms/video-types'
import type { VideoSeriesListItem } from '@/lib/cms/video-series-types'

const DESKTOP_SERIES_BG = ['bg-magenta', 'bg-forest', 'bg-teal'] as const

export function WatchExperience({
  videos,
  seriesList,
  initialSlug,
}: {
  videos: WatchVideoItem[]
  seriesList: VideoSeriesListItem[]
  initialSlug?: string
}) {
  return (
    <Suspense fallback={null}>
      <WatchExperienceInner videos={videos} seriesList={seriesList} initialSlug={initialSlug} />
    </Suspense>
  )
}

function WatchExperienceInner({
  videos,
  seriesList,
  initialSlug,
}: {
  videos: WatchVideoItem[]
  seriesList: VideoSeriesListItem[]
  initialSlug?: string
}) {
  const searchParams = useSearchParams()
  const playerRef = useRef<HTMLDivElement>(null)
  const defaultVideo = useMemo(
    () => videos.find((v) => v.slug === initialSlug) || videos.find((v) => v.featured) || videos.find((v) => v.playback) || videos[0],
    [videos, initialSlug],
  )
  const [activeSlug, setActiveSlug] = useState(defaultVideo?.slug)

  const heroPreview = useMemo(() => {
    const featuredFile = videos.find((video) => video.featured && video.playback?.kind === 'file')
    const firstFile = videos.find((video) => video.playback?.kind === 'file')
    return featuredFile || firstFile || defaultVideo
  }, [videos, defaultVideo])

  const activeVideo = videos.find((v) => v.slug === activeSlug) || defaultVideo

  const category = searchParams.get('category') || 'all'
  const watchFilters = WATCH_CATEGORIES.map((cat) => ({ label: cat.label, slug: cat.slug }))
  const filteredVideos = useMemo(() => {
    if (category === 'all') return videos
    return videos.filter((video) => video.type === category)
  }, [videos, category])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && videos.some((v) => v.slug === hash)) {
      setActiveSlug(hash)
    }
  }, [videos])

  function selectVideo(slug: string) {
    setActiveSlug(slug)
    window.history.replaceState(null, '', `#${slug}`)
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <WatchHero preview={heroPreview} />

      {activeVideo ? (
        <section className="watch-featured" aria-label="Featured video">
          <div className="watch-featured__inner">
            <FeaturedVideoPlayer key={activeVideo.slug} video={activeVideo} playerRef={playerRef} />
          </div>
        </section>
      ) : null}

      <section className="section on-paper watch-more-section" id="watch-videos">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Watch more videos</h2>
              <p className="watch-more-section__lede">
                Documentaries, field reports, interviews, and community spotlights from across EcoDiaries.
              </p>
            </div>
          </div>
          <Suspense fallback={null}>
            <FilterPills
              filters={watchFilters}
              paramKey="category"
              basePath="/watch"
              modalTitle="Filter by format"
            />
          </Suspense>
          <WatchMoreVideos videos={filteredVideos} activeSlug={activeSlug} onSelect={selectVideo} />
        </div>
      </section>

      <WatchSeriesMobileRow series={seriesList} />

      <section className="section watch-series-section hidden md:block" id="watch-series-desktop" aria-label="Series">
        <div className="wrap">
          <div className="section-head">
            <h2>Series</h2>
          </div>
          <div className="card-grid grid-3">
            {seriesList.map((item, index) => (
              <div key={item.slug} className={`audio-tile ${DESKTOP_SERIES_BG[index % DESKTOP_SERIES_BG.length]}`}>
                <div>
                  <span className="audio-meta">SERIES</span>
                  <h4 className="mt-8">{item.title}</h4>
                </div>
                <button className="play-btn watch-series-play" aria-label="View series" type="button">
                  <PlayIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
