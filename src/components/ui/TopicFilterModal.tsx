'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'

type TopicFilterModalProps = {
  open: boolean
  onClose: () => void
  filters: { label: string; slug: string }[]
  paramKey?: string
  basePath?: string
  title?: string
}

export function TopicFilterModal({
  open,
  onClose,
  filters,
  paramKey = 'category',
  basePath,
  title = 'Filter by topic',
}: TopicFilterModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const reduce = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const path = basePath || pathname
  const active = searchParams.get(paramKey) || 'all'

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  function selectTopic(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') params.delete(paramKey)
    else params.set(paramKey, slug)
    const qs = params.toString()
    router.push(qs ? `${path}?${qs}` : path, { scroll: false })
    onClose()
  }

  const topics = filters.filter((f) => f.slug !== 'all')

  return (
    <div
      className="topic-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="topic-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-modal-title"
        style={reduce ? undefined : { animation: 'fadeIn .2s ease' }}
      >
        <button type="button" className="topic-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="topic-modal-title">{title}</h2>
        <div className="topic-modal-grid">
          <button
            type="button"
            className={`filter-pill${active === 'all' ? ' active' : ''}`}
            onClick={() => selectTopic('all')}
          >
            All topics
          </button>
          {topics.map(({ label, slug }) => (
            <button
              key={slug}
              type="button"
              className={`filter-pill${active === slug ? ' active' : ''}`}
              onClick={() => selectTopic(slug)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
