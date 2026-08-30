'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HERO_NATURE_IMAGE } from '@/lib/unsplash-environment'

export type MagHeroSlide = {
  href: string
  image: string
  category: string
  title: string
  byline?: string
  avatar?: string
}

function HeroAvatar({ src, name }: { src?: string; name?: string }) {
  const initial = (name || 'E').trim().charAt(0).toUpperCase() || 'E'
  if (src) {
    return <Image src={src} alt="" width={36} height={36} />
  }
  return (
    <span className="mag-hero__avatar-fallback" aria-hidden>
      {initial}
    </span>
  )
}

export function MagHero({ slides }: { slides: MagHeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const [broken, setBroken] = useState<Record<number, boolean>>({})
  const safeSlides = slides.length ? slides : []

  function goTo(next: number) {
    setOutgoing(index)
    setIndex(next)
  }

  useEffect(() => {
    if (outgoing === null) return
    const timer = window.setTimeout(() => setOutgoing(null), 700)
    return () => window.clearTimeout(timer)
  }, [outgoing])

  useEffect(() => {
    if (safeSlides.length < 2) return
    const timer = window.setInterval(() => {
      setOutgoing(index)
      setIndex((current) => (current + 1) % safeSlides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [index, safeSlides.length])

  const slide = safeSlides[index]
  if (!slide) return null

  return (
    <section className="mag-hero-frame" aria-label="Featured">
      <div className="mag-wrap">
        <div className="mag-hero">
          {safeSlides.map((item, i) => {
            const isActive = i === index
            const shouldPaint = isActive || i === outgoing || i === 0
            const src = broken[i] ? HERO_NATURE_IMAGE : item.image
            return (
              <div key={item.href} className={`mag-hero__slide${isActive ? ' is-active' : ''}`}>
                {shouldPaint ? (
                  <Image
                    src={src}
                    alt={i === 0 ? 'Sunlit forest canopy' : ''}
                    fill
                    priority={i === 0}
                    quality={75}
                    sizes="(max-width: 980px) 100vw, 1180px"
                    onError={() => setBroken((prev) => (prev[i] ? prev : { ...prev, [i]: true }))}
                  />
                ) : null}
              </div>
            )
          })}
          <div className="mag-hero__shade" />
          <div className="mag-hero__overlay">
            <div className="mag-hero__copy">
              <span className="mag-chip">{slide.category}</span>
              <h1 className="mag-title">
                <Link href={slide.href} prefetch={false}>
                  {slide.title}
                </Link>
              </h1>
              {slide.byline ? (
                <div className="mag-hero__by">
                  <HeroAvatar src={slide.avatar} name={slide.byline} />
                  <span>{slide.byline}</span>
                </div>
              ) : null}
            </div>
            {safeSlides.length > 1 ? (
              <div className="mag-hero__thumbs" role="tablist" aria-label="Featured slides">
                {safeSlides.map((item, i) => (
                  <button
                    key={item.href}
                    type="button"
                    role="tab"
                    className={`mag-hero__thumb${i === index ? ' is-active' : ''}`}
                    aria-label={`Show ${item.title}`}
                    aria-selected={i === index}
                    onClick={() => goTo(i)}
                  >
                    <Image
                      src={broken[i] ? HERO_NATURE_IMAGE : item.image}
                      alt=""
                      width={64}
                      height={64}
                      quality={60}
                      onError={() => setBroken((prev) => (prev[i] ? prev : { ...prev, [i]: true }))}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {safeSlides.length > 1 ? (
            <div className="mag-hero__dots" role="tablist" aria-label="Featured slides">
              {safeSlides.map((item, i) => (
                <button
                  key={`${item.href}-dot`}
                  type="button"
                  className={`mag-hero__dot${i === index ? ' is-active' : ''}`}
                  aria-label={`Show ${item.title}`}
                  aria-selected={i === index}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
