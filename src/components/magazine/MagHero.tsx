'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const safeSlides = slides.length ? slides : []

  useEffect(() => {
    if (safeSlides.length < 2) return
    const timer = window.setInterval(() => {
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
          {safeSlides.map((item, i) => (
            <div key={item.href} className={`mag-hero__slide${i === index ? ' is-active' : ''}`}>
              <Image
                src={item.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 980px) 100vw, 1180px"
              />
            </div>
          ))}
          <div className="mag-hero__shade" />
          <div className="mag-hero__overlay">
            <div className="mag-hero__copy">
              <span className="mag-chip">{slide.category}</span>
              <h1 className="mag-title">
                <Link href={slide.href}>{slide.title}</Link>
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
                    onClick={() => setIndex(i)}
                  >
                    <Image src={item.image} alt="" width={64} height={64} />
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
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
