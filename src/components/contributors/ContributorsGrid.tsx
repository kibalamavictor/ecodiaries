'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Contributor, ContributorCategory } from '@/lib/contributors/types'
import { CATEGORY_QUERY_MAP, CONTRIBUTOR_FILTER_OPTIONS, QUERY_FROM_CATEGORY } from '@/lib/contributors/types'
import { ContributorCard } from '@/components/contributors/ContributorCard'
import { FilterPills } from '@/components/ui/FilterPills'

const PAGE_SIZE = 6
const SWIPE_THRESHOLD_PX = 48
const WHEEL_THRESHOLD_PX = 42
const CATEGORY_COOLDOWN_MS = 420

const contributorFilters = CONTRIBUTOR_FILTER_OPTIONS.map((option) => ({
  label: option.label,
  slug: option.value === 'all' ? 'all' : QUERY_FROM_CATEGORY[option.value],
}))

const CATEGORY_SLUGS = contributorFilters.map((filter) => filter.slug)

function ContributorFilters() {
  return (
    <Suspense fallback={null}>
      <FilterPills
        filters={contributorFilters}
        paramKey="category"
        basePath="/contributors"
        modalTitle="Filter by contribution type"
      />
    </Suspense>
  )
}

export function ContributorsGrid({ contributors }: { contributors: Contributor[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const swipeZoneRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const categoryCooldownRef = useRef(false)

  const [activeFilter, setActiveFilter] = useState<ContributorCategory | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const activeCategorySlug = searchParams.get('category') || 'all'

  useEffect(() => {
    const raw = searchParams.get('category') || 'all'
    setActiveFilter(CATEGORY_QUERY_MAP[raw] ?? 'all')
  }, [searchParams])

  const navigateCategory = useCallback(
    (direction: 1 | -1) => {
      if (categoryCooldownRef.current) return

      const currentIndex = CATEGORY_SLUGS.indexOf(activeCategorySlug)
      if (currentIndex === -1) return

      const nextSlug =
        CATEGORY_SLUGS[(currentIndex + direction + CATEGORY_SLUGS.length) % CATEGORY_SLUGS.length]
      const params = new URLSearchParams(searchParams.toString())

      if (nextSlug === 'all') params.delete('category')
      else params.set('category', nextSlug)

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })

      categoryCooldownRef.current = true
      window.setTimeout(() => {
        categoryCooldownRef.current = false
      }, CATEGORY_COOLDOWN_MS)
    },
    [activeCategorySlug, pathname, router, searchParams],
  )

  useEffect(() => {
    const zone = swipeZoneRef.current
    if (!zone) return

    function onWheel(event: WheelEvent) {
      if (categoryCooldownRef.current) return
      if (Math.abs(event.deltaX) < WHEEL_THRESHOLD_PX) return
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return

      event.preventDefault()
      navigateCategory(event.deltaX > 0 ? 1 : -1)
    }

    zone.addEventListener('wheel', onWheel, { passive: false })
    return () => zone.removeEventListener('wheel', onWheel)
  }, [navigateCategory])

  const visibleContributors = useMemo(
    () =>
      activeFilter === 'all'
        ? contributors
        : contributors.filter((c) => c.categories.includes(activeFilter)),
    [activeFilter, contributors],
  )

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeFilter, visibleContributors])

  const shown = visibleContributors.slice(0, visibleCount)
  const hasMore = visibleCount < visibleContributors.length
  const activeLabel = contributorFilters.find((filter) => filter.slug === activeCategorySlug)?.label ?? 'All'

  function onTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStartRef.current
    if (!start) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    touchStartRef.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return

    navigateCategory(deltaX < 0 ? 1 : -1)
  }

  return (
    <section className="contributors-list-section bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ContributorFilters />
        <p className="contributors-grid__count">
          Showing {shown.length} of {visibleContributors.length} contributor
          {visibleContributors.length === 1 ? '' : 's'}
          <span className="contributors-grid__count-category"> · {activeLabel}</span>
        </p>
        <p className="contributors-grid__swipe-hint" aria-hidden>
          Swipe sideways to browse categories
        </p>

        <div
          ref={swipeZoneRef}
          className="contributors-grid__swipe-zone"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {visibleContributors.length === 0 ? (
            <p className="contributors-grid__empty">No contributors in this category yet.</p>
          ) : (
            <>
              <div className="contributors-grid__cards" key={activeCategorySlug}>
                {shown.map((contributor) => (
                  <ContributorCard key={contributor.id} contributor={contributor} compact />
                ))}
              </div>
              {hasMore ? (
                <div className="contributors-grid__more-wrap">
                  <button
                    type="button"
                    className="contributors-grid__more-btn"
                    onClick={() =>
                      setVisibleCount((count) => Math.min(count + PAGE_SIZE, visibleContributors.length))
                    }
                  >
                    See more
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
