'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

export type MagStripItem = {
  href: string
  image: string
  title: string
  authorName?: string
}

export function MagHeroStrip({
  items,
  label = 'More stories',
}: {
  items: MagStripItem[]
  label?: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)
  const [progress, setProgress] = useState(0.22)

  const sync = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setOverflows(max > 8)
    setProgress(max <= 0 ? 1 : Math.max(0.22, Math.min(1, el.scrollLeft / max)))
  }, [])

  useEffect(() => {
    sync()
    const el = scrollerRef.current
    if (!el) return
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync, items.length])

  if (!items.length) return null

  return (
    <section className="mag-hero-strip" aria-label={label}>
      <div className="mag-wrap mag-hero-strip__frame">
        <div className="mag-hero-strip__row" ref={scrollerRef} onScroll={sync}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="mag-hero-strip__item">
              <span className="mag-hero-strip__media">
                <Image src={item.image} alt="" fill sizes="88px" />
              </span>
              <span className="mag-hero-strip__copy">
                <span className="mag-title mag-hero-strip__title">{item.title}</span>
                {item.authorName ? <span className="mag-hero-strip__by">By {item.authorName}</span> : null}
              </span>
            </Link>
          ))}
        </div>
        {overflows ? (
          <button
            type="button"
            className="mag-hero-strip__next"
            aria-label="Show more"
            onClick={() => {
              const el = scrollerRef.current
              if (!el) return
              const max = el.scrollWidth - el.clientWidth
              if (el.scrollLeft >= max - 12) {
                el.scrollTo({ left: 0, behavior: 'smooth' })
                return
              }
              el.scrollBy({ left: 320, behavior: 'smooth' })
            }}
          >
            <span aria-hidden>→</span>
          </button>
        ) : null}
        <div className="mag-hero-strip__track" aria-hidden>
          <div className="mag-hero-strip__bar" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  )
}
