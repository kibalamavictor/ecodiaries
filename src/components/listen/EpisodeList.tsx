'use client'

import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import { EpisodeCard } from '@/components/listen/EpisodeCard'

export function EpisodeList({ episodes }: { episodes: PodcastEpisode[] }) {
  return (
    <div className="episode-list-grid">
      {episodes.map((ep) => (
        <EpisodeCard key={ep.id} episode={ep} />
      ))}
    </div>
  )
}
