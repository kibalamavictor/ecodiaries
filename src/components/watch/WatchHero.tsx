import Link from 'next/link'
import { SiteNav } from '@/components/layout/SiteNav'
import { MobilePageHero } from '@/components/mobile/MobilePageHero'
import { WatchHeroBackground } from '@/components/watch/WatchHeroBackground'
import type { WatchVideoItem } from '@/lib/cms/video-types'

const HERO_LEAD = 'Documentaries, field reports, interviews, and community spotlights'

type WatchHeroProps = {
  preview?: WatchVideoItem | null
}

function heroPreviewSource(video?: WatchVideoItem | null) {
  if (!video) return { poster: '', videoSrc: null as string | null }

  return {
    poster: video.image,
    videoSrc: video.playback?.kind === 'file' ? video.playback.src : null,
  }
}

export function WatchHero({ preview }: WatchHeroProps) {
  const { poster, videoSrc } = heroPreviewSource(preview)

  return (
    <>
      <header className="watch-hero hidden md:block">
        {poster ? <WatchHeroBackground poster={poster} videoSrc={videoSrc} /> : null}
        <div className="watch-hero-content">
          <SiteNav variant="light" activeLink="/watch" />
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Watch</h1>
            <p className="watch-hero-subline mt-2 max-w-2xl text-base text-white/80 sm:text-lg">{HERO_LEAD}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              The visual side of EcoDiaries reporting — field documentaries and community spotlights filmed where climate
              stories actually happen.
            </p>
            <Link
              href="#watch-series"
              className="mt-6 inline-flex items-center rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Browse series
            </Link>
            <Link
              href="#watch-player"
              className="mt-8 inline-flex items-center rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-forest transition hover:brightness-95"
            >
              Watch now
            </Link>
          </div>
        </div>
      </header>

      <div className="watch-hero watch-hero--mobile md:hidden">
        {poster ? <WatchHeroBackground poster={poster} videoSrc={videoSrc} /> : null}
        <div className="watch-hero-content">
          <MobilePageHero
            className="watch-mobile-hero"
            title="Watch"
            lead={HERO_LEAD}
            activeLink="/watch"
            showSearch={false}
          />
        </div>
      </div>
    </>
  )
}
