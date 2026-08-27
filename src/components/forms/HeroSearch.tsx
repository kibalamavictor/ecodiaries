'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from '@/components/icons'

type HeroSearchProps = {
  className?: string
  style?: React.CSSProperties
  defaultValue?: string
  action?: string
  placeholder?: string
  preserveParams?: boolean
  submitButtonClassName?: string
}

export function HeroSearch({
  className = 'hero-search',
  style,
  defaultValue = '',
  action = '/stories',
  placeholder = 'Search stories, topics, solutions, or places…',
  preserveParams = false,
  submitButtonClassName = 'btn btn-primary btn-sm',
}: HeroSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue || searchParams.get('q') || '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const params = preserveParams ? new URLSearchParams(searchParams.toString()) : new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    else params.delete('q')
    const qs = params.toString()
    router.push(qs ? `${action}?${qs}` : action)
  }

  return (
    <form className={className} style={style} onSubmit={handleSubmit}>
      <SearchIcon />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={submitButtonClassName}>
        Search
      </button>
    </form>
  )
}
