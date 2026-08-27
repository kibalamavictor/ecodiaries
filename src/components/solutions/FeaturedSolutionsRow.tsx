'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MobileSolutionCard } from '@/components/mobile/MobileSolutionCard'
import { STATUS_LABELS, type AtlasProject } from '@/lib/solutions/types'

const AUTO_ADVANCE_MS = 5500

type FeaturedSolutionsRowProps = {
  projects: AtlasProject[]
}

export function FeaturedSolutionsRow({ projects }: FeaturedSolutionsRowProps) {
  const featured = projects.filter((p) => p.featured)
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const [paused, setPaused] = useState(false)

  const scrollToIndex = useCallback(
    (index: number) => {
      const item = itemRefs.current[index]
      if (!item) return
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      item.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest',
      })
    },
    [],
  )

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, featured.length)
  }, [featured.length])

  useEffect(() => {
    if (featured.length <= 1 || paused) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    let activeIndex = activeIndexRef.current
    const timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % featured.length
      activeIndexRef.current = activeIndex
      scrollToIndex(activeIndex)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [featured.length, paused, scrollToIndex])

  if (!featured.length) return null

  return (
    <section
      className="solutions-featured"
      aria-label="Featured solutions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 1200)
      }}
    >
      <h3 className="solutions-featured__title">Featured solutions</h3>
      <div
        ref={scrollRef}
        className="solutions-featured-scroll scroll-edge-fade mobile-scroll-card-scope scrollbar-hide"
        aria-roledescription="carousel"
      >
        {featured.map((solution, index) => (
          <div
            key={solution.id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="solutions-featured-scroll__item"
          >
            <MobileSolutionCard solution={solution} statusLabel={STATUS_LABELS[solution.status]} />
          </div>
        ))}
      </div>
    </section>
  )
}
