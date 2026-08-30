'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

const STORY_TOPICS = [
  { label: 'All', slug: 'all' },
  { label: 'Climate', slug: 'climate-change' },
  { label: 'Water', slug: 'water' },
  { label: 'Biodiversity', slug: 'biodiversity' },
  { label: 'Pollution', slug: 'pollution' },
  { label: 'Agriculture', slug: 'agriculture' },
  { label: 'Energy', slug: 'renewable-energy' },
  { label: 'Opinion', slug: 'opinion' },
] as const

export function MobileBrowseBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(query)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const topicLabel = STORY_TOPICS.find((topic) => topic.slug === category)?.label
  const summary = [query && `“${query}”`, category !== 'all' && topicLabel].filter(Boolean).join(' · ')

  function onSearch(event: FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const next = draft.trim()
    if (next) params.set('q', next)
    else params.delete('q')
    const qs = params.toString()
    router.push(qs ? `/stories?${qs}` : '/stories')
    setOpen(false)
  }

  function selectTopic(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') params.delete('category')
    else params.set('category', slug)
    const qs = params.toString()
    router.push(qs ? `/stories?${qs}` : '/stories')
    setOpen(false)
  }

  return (
    <>
      <button type="button" className="mobile-browse-bar" onClick={() => setOpen(true)}>
        <span>
          {summary ? <strong>{summary}</strong> : 'Search stories or filter by topic'}
        </span>
        <span aria-hidden>⌕</span>
      </button>
      {open ? (
        <div className="mobile-browse-sheet" role="dialog" aria-label="Search and filter stories">
          <button type="button" className="mag-link" onClick={() => setOpen(false)}>
            Close
          </button>
          <form onSubmit={onSearch}>
            <input
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search stories, topics, or places…"
              aria-label="Search stories"
              autoFocus
            />
            <button type="submit" className="mag-btn">
              Search
            </button>
          </form>
          <div className="mobile-browse-sheet__topics">
            {STORY_TOPICS.map((topic) => (
              <button
                key={topic.slug}
                type="button"
                className={`mag-tag${category === topic.slug ? ' mag-tag--active' : ''}`}
                onClick={() => selectTopic(topic.slug)}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
