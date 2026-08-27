'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { HostAvatars } from '@/components/listen/HostAvatars'
import { PodcasterCard } from '@/components/listen/PodcasterCard'
import { formatHostedByLabel } from '@/lib/listen/format-host-names'
import type { PodcastHost } from '@/lib/cms/podcast-types'

type ListenCollapsedHostsRowProps = {
  hosts: PodcastHost[]
  onToggle?: (open: boolean) => void
}

export function ListenCollapsedHostsRow({ hosts, onToggle }: ListenCollapsedHostsRowProps) {
  const [open, setOpen] = useState(false)

  if (!hosts.length) return null

  const label = formatHostedByLabel(hosts)

  function toggle() {
    setOpen((value) => {
      const next = !value
      onToggle?.(next)
      return next
    })
  }

  return (
    <div className={`listen-hosts-collapse${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="listen-hosts-collapse__trigger"
        onClick={toggle}
        aria-expanded={open}
      >
        <HostAvatars hosts={hosts} size={22} max={3} />
        <span className="listen-hosts-collapse__label">
          Hosted by <strong>{label}</strong>
        </span>
        <ChevronDown className="listen-hosts-collapse__chevron" aria-hidden />
      </button>
      {open ? (
        <div className="listen-hosts-collapse__panel">
          {hosts.map((host) => (
            <PodcasterCard key={`${host.name}-${host.role}`} host={host} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
