'use client'

import Image from 'next/image'
import type { PodcastHost } from '@/lib/cms/podcast-types'

import type { CSSProperties } from 'react'

export function HostAvatars({
  hosts,
  size = 36,
  max = 3,
}: {
  hosts: PodcastHost[]
  size?: number
  max?: number
}) {
  if (!hosts.length) return null
  const visible = hosts.slice(0, max)
  const extra = hosts.length - max

  return (
    <div className="host-avatars" style={{ '--avatar-size': `${size}px` } as CSSProperties}>
      {visible.map((host) => (
        <span key={host.name} className="host-avatars__item" title={host.name}>
          {host.avatar ? (
            <Image
              src={host.avatar}
              alt=""
              width={size}
              height={size}
              className="host-avatars__img"
            />
          ) : (
            <span className="host-avatars__fallback" aria-hidden>
              {host.name.charAt(0)}
            </span>
          )}
        </span>
      ))}
      {extra > 0 ? <span className="host-avatars__more">+{extra}</span> : null}
    </div>
  )
}
