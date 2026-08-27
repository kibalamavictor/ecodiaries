'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProgrammeCard } from '@/components/programmes/ProgrammeCard'
import type { Programme } from '@/lib/programmes/types'

const AUTO_ADVANCE_MS = 5000
const SWIPE_THRESHOLD_PX = 40

type OpportunitiesFeaturedCarouselProps = {
  programmes: Programme[]
  showHead?: boolean
  autoAdvance?: boolean
}

export function OpportunitiesFeaturedCarousel({
  programmes,
  showHead = true,
  autoAdvance = true,
}: OpportunitiesFeaturedCarouselProps) {
  const count = programmes.length
  const canSlide = count > 1
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (count < 1) return
      setActive(((index % count) + count) % count)
    },
    [count],
  )

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    if (!autoAdvance || !canSlide || paused) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [autoAdvance, canSlide, paused, count])

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    setPaused(true)
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    const startX = touchStartX.current
    touchStartX.current = null
    if (startX == null) {
      setPaused(false)
      return
    }

    const deltaX = (event.changedTouches[0]?.clientX ?? startX) - startX
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
      if (deltaX < 0) next()
      else prev()
    }

    window.setTimeout(() => setPaused(false), 1200)
  }

  if (!count) return null

  return (
    <section
      className="opportunities-featured"
      aria-label="Featured opportunities"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {showHead ? (
        <div className="opportunities-section-head">
          <h2 className="opportunities-section-head__title">Featured opportunities</h2>
          <p className="opportunities-section-head__lede">
            Highlighted programmes, grants, fellowships, and events
          </p>
        </div>
      ) : null}

      <div className="opportunities-featured__frame">
        {canSlide ? (
          <button
            type="button"
            className="opportunities-featured__nav opportunities-featured__nav--prev"
            onClick={prev}
            aria-label="Previous featured opportunity"
          >
            <ChevronLeft aria-hidden />
          </button>
        ) : null}

        <div className="opportunities-featured__viewport">
          <div
            className="opportunities-featured__track"
            style={{ transform: canSlide ? `translateX(-${active * 100}%)` : undefined }}
          >
            {programmes.map((programme, index) => (
              <div
                key={programme.slug}
                className="opportunities-featured__slide"
                aria-hidden={canSlide ? index !== active : undefined}
              >
                <div className="opportunities-carousel__card-shell opportunities-carousel__card-shell--featured">
                  <ProgrammeCard programme={programme} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {canSlide ? (
          <button
            type="button"
            className="opportunities-featured__nav opportunities-featured__nav--next"
            onClick={next}
            aria-label="Next featured opportunity"
          >
            <ChevronRight aria-hidden />
          </button>
        ) : null}
      </div>

      {canSlide ? (
        <div className="opportunities-featured__dots" role="tablist" aria-label="Featured opportunity slides">
          {programmes.map((programme, index) => (
            <button
              key={programme.slug}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Go to featured opportunity ${index + 1}: ${programme.title}`}
              className={
                index === active
                  ? 'opportunities-featured__dot opportunities-featured__dot--active'
                  : 'opportunities-featured__dot'
              }
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
