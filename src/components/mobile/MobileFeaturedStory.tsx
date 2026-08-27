'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { StoryPreview } from '@/lib/types'

const AUTO_ADVANCE_MS = 5500
const SWIPE_THRESHOLD_PX = 40

type MobileFeaturedStoryProps = {
  stories: StoryPreview[]
}

function FeaturedStorySlide({
  story,
  priority,
}: {
  story: StoryPreview
  priority?: boolean
}) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="mobile-featured-carousel__card block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          decoding={priority ? undefined : 'async'}
        />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-brand-lime px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.03em] text-brand-forest">
            Featured
          </span>
          <span className="rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.03em] text-white">
            {story.category}
          </span>
        </div>
      </div>

      <div className="space-y-2 p-3">
        <h2 className="line-clamp-2 text-[17px] font-semibold leading-snug text-foreground">
          {story.title}
        </h2>
        {story.excerpt ? (
          <p className="line-clamp-2 text-[12px] leading-snug text-muted-foreground">{story.excerpt}</p>
        ) : null}
        {story.author ? (
          <div className="flex items-center gap-2 pt-0.5">
            <Image
              src={story.author.avatar}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-foreground">{story.author.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{story.author.role}</p>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  )
}

export function MobileFeaturedStory({ stories }: MobileFeaturedStoryProps) {
  const count = stories.length
  const canAutoSlide = count > 1
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
    if (!canAutoSlide || paused) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [canAutoSlide, paused, count])

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

  if (count === 0) return null

  if (!canAutoSlide) {
    return (
      <section className="mobile-featured-carousel px-4 pb-2 pt-3" aria-label="Featured story">
        <FeaturedStorySlide story={stories[0]} priority />
      </section>
    )
  }

  return (
    <section
      className="mobile-featured-carousel px-4 pb-2 pt-3"
      aria-label="Featured stories"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mobile-featured-carousel__viewport overflow-hidden">
        <div
          className="mobile-featured-carousel__track flex"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {stories.map((story, index) => (
            <div
              key={story.slug}
              className="mobile-featured-carousel__slide w-full shrink-0"
              aria-hidden={index !== active}
            >
              <FeaturedStorySlide story={story} priority={index === 0} />
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-featured-carousel__dots" role="tablist" aria-label="Featured story slides">
        {stories.map((story, index) => (
          <button
            key={story.slug}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Go to featured story ${index + 1}: ${story.title}`}
            className={
              index === active
                ? 'mobile-featured-carousel__dot mobile-featured-carousel__dot--active'
                : 'mobile-featured-carousel__dot'
            }
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  )
}
