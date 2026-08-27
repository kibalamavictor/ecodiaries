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

export function MagHero({ slides }: { slides: MagHeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const safeSlides = slides.length ? slides : []

  useEffect(() => {
    if (safeSlides.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [safeSlides.length])

  const slide = safeSlides[index]
  if (!slide) return null

  return (
    <section className="mag-hero" aria-label="Featured solutions">
      {safeSlides.map((item, i) => (
        <div key={item.href} className={`mag-hero__slide${i === index ? ' is-active' : ''}`}>
          <Image src={item.image} alt="" fill priority={i === 0} sizes="100vw" />
        </div>
      ))}
      <div className="mag-hero__shade" />
      <div className="mag-wrap mag-hero__copy">
        <span className="mag-chip">{slide.category}</span>
        <h1 className="mag-title">
          <Link href={slide.href}>{slide.title}</Link>
        </h1>
        {slide.byline ? (
          <div className="mag-hero__by">
            {slide.avatar ? <Image src={slide.avatar} alt="" width={32} height={32} /> : null}
            <span>{slide.byline}</span>
          </div>
        ) : null}
      </div>
      {safeSlides.length > 1 ? (
        <>
          <div className="mag-hero__thumbs" role="tablist" aria-label="Featured slides">
            {safeSlides.map((item, i) => (
              <button
                key={item.href}
                type="button"
                className={`mag-hero__thumb${i === index ? ' is-active' : ''}`}
                aria-label={`Show ${item.title}`}
                aria-selected={i === index}
                onClick={() => setIndex(i)}
              >
                <Image src={item.image} alt="" width={58} height={58} />
              </button>
            ))}
          </div>
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
        </>
      ) : null}
    </section>
  )
}
