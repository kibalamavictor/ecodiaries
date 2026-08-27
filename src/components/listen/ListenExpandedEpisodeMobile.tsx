'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import type { PodcastEpisode } from '@/lib/cms/podcast-types'
import { formatEpisodeMeta } from '@/lib/listen/episode-meta'
import { ListenCollapsedHostsRow } from '@/components/listen/ListenCollapsedHostsRow'

type ListenExpandedEpisodeMobileProps = {
  episode: PodcastEpisode
  headingLevel?: 'h2' | 'h3'
  children?: ReactNode
}

export function ListenExpandedEpisodeMobile({
  episode,
  headingLevel: Heading = 'h2',
  children,
}: ListenExpandedEpisodeMobileProps) {
  const [hostsOpen, setHostsOpen] = useState(false)
  const meta = formatEpisodeMeta(episode, { numericDate: true })

  return (
    <div className={`listen-expanded-mobile${hostsOpen ? ' listen-expanded-mobile--hosts-open' : ''}`}>
      <div className="listen-expanded-mobile__header">
        <div className="listen-expanded-mobile__thumb">
          <Image
            src={episode.thumbnail}
            alt=""
            width={64}
            height={64}
            sizes="64px"
            className="listen-expanded-mobile__thumb-image"
          />
        </div>
        <div className="listen-expanded-mobile__copy">
          <Heading className="listen-expanded-mobile__title">{episode.title}</Heading>
          <p className="listen-expanded-mobile__series">{episode.series}</p>
          {meta ? <p className="listen-expanded-mobile__meta">{meta}</p> : null}
        </div>
      </div>

      {children}

      <ListenCollapsedHostsRow hosts={episode.hosts} onToggle={setHostsOpen} />
    </div>
  )
}
