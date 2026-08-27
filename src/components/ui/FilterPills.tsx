'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { TopicFilterModal } from '@/components/ui/TopicFilterModal'

type FilterPillsProps = {
  filters: { label: string; slug: string }[]
  paramKey?: string
  basePath?: string
  modalTitle?: string
}

export function FilterPills({ filters, paramKey = 'category', basePath, modalTitle }: FilterPillsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get(paramKey) || 'all'
  const path = basePath || pathname
  const [modalOpen, setModalOpen] = useState(false)

  function hrefFor(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') params.delete(paramKey)
    else params.set(paramKey, slug)
    const qs = params.toString()
    return qs ? `${path}?${qs}` : path
  }

  return (
    <>
      <div className="filter-row">
        <button
          type="button"
          className={`filter-pill${active === 'all' ? ' active' : ''}`}
          onClick={() => setModalOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={modalOpen}
        >
          All
        </button>
        {filters
          .filter((f) => f.slug !== 'all')
          .map(({ label, slug }) => (
            <Link
              key={slug}
              href={hrefFor(slug)}
              className={`filter-pill${active === slug ? ' active' : ''}`}
              scroll={false}
            >
              {label}
            </Link>
          ))}
      </div>
      <TopicFilterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        filters={filters}
        paramKey={paramKey}
        basePath={basePath}
        title={modalTitle}
      />
    </>
  )
}
