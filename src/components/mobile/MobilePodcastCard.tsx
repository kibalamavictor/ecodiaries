import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import { MobileCardText } from '@/components/mobile/MobileCardText'

type MobilePodcastCardProps = {
  episode: Pick<PodcastEpisode, 'slug' | 'title' | 'duration' | 'num' | 'thumbnail' | 'description' | 'series'>
}

export function MobilePodcastCard({ episode }: MobilePodcastCardProps) {
  return (
    <Link
      href={`/listen#${episode.slug}`}
      className="mobile-scroll-card flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5"
    >
      <div className="mobile-scroll-card__media relative">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 767px) 82vw, 320px"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-lime/90">
            <Play className="ml-0.5 h-4 w-4 text-brand-forest" fill="#0C1400" />
          </div>
        </div>
        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold leading-none tracking-[0.03em] text-brand-lime">
          EP. {episode.num || '—'}
        </span>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
          {episode.duration}
        </span>
      </div>
      <MobileCardText title={episode.title} description={episode.description} meta={episode.series} />
    </Link>
  )
}
