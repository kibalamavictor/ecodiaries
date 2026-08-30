'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

export type BrowseTopic = {
  label: string
  slug: string
}

const STORY_TOPICS: BrowseTopic[] = [
  { label: 'All', slug: 'all' },
  { label: 'Climate', slug: 'climate-change' },
  { label: 'Water', slug: 'water' },
  { label: 'Biodiversity', slug: 'biodiversity' },
  { label: 'Pollution', slug: 'pollution' },
  { label: 'Agriculture', slug: 'agriculture' },
  { label: 'Energy', slug: 'renewable-energy' },
  { label: 'Opinion', slug: 'opinion' },
]

export type MobileBrowseBarProps = {
  basePath?: string
  paramKey?: string
  aliasParams?: string[]
  topics?: readonly BrowseTopic[]
  placeholder?: string
  emptyLabel?: string
  searchAriaLabel?: string
  dialogLabel?: string
  clearParams?: string[]
  showSearch?: boolean
}

export function MobileBrowseBar({
  basePath = '/stories',
  paramKey = 'category',
  aliasParams = [],
  topics = STORY_TOPICS,
  placeholder = 'Search stories, topics, or places…',
  emptyLabel = 'Search stories or filter by topic',
  searchAriaLabel = 'Search stories',
  dialogLabel = 'Search and filter stories',
  clearParams = ['page'],
  showSearch = true,
}: MobileBrowseBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const selected =
    searchParams.get(paramKey) || aliasParams.map((key) => searchParams.get(key)).find(Boolean) || 'all'
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(query)

  useEffect(() => {
    setDraft(query)
  }, [query])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const topicLabel = topics.find((topic) => topic.slug === selected)?.label
  const summary = [query && `“${query}”`, selected !== 'all' && topicLabel].filter(Boolean).join(' · ')

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString())
    for (const key of clearParams) params.delete(key)
    mutate(params)
    const qs = params.toString()
    router.push(qs ? `${basePath}?${qs}` : basePath)
    setOpen(false)
  }

  function onSearch(event: FormEvent) {
    event.preventDefault()
    pushParams((params) => {
      const next = draft.trim()
      if (next) params.set('q', next)
      else params.delete('q')
    })
  }

  function selectTopic(slug: string) {
    pushParams((params) => {
      for (const key of aliasParams) params.delete(key)
      if (slug === 'all') params.delete(paramKey)
      else params.set(paramKey, slug)
    })
  }

  return (
    <>
      <button type="button" className="mobile-browse-bar" onClick={() => setOpen(true)}>
        <span>{summary ? <strong>{summary}</strong> : emptyLabel}</span>
        <span aria-hidden>{showSearch ? '⌕' : '›'}</span>
      </button>
      {open ? (
        <div className="mobile-browse-sheet" role="dialog" aria-label={dialogLabel}>
          <button type="button" className="mag-link" onClick={() => setOpen(false)}>
            Close
          </button>
          {showSearch ? (
            <form onSubmit={onSearch}>
              <input
                type="search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={placeholder}
                aria-label={searchAriaLabel}
                autoFocus
              />
              <button type="submit" className="mag-btn">
                Search
              </button>
            </form>
          ) : null}
          <div className="mobile-browse-sheet__topics">
            {topics.map((topic) => (
              <button
                key={topic.slug}
                type="button"
                className={`mag-tag${selected === topic.slug ? ' mag-tag--active' : ''}`}
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
