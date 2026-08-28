import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { MagCard, type MagCardItem } from '@/components/magazine/MagCard'
import { MagNewsletter } from '@/components/magazine/MagNewsletter'
import { environmentImageForKey } from '@/lib/unsplash-environment'

export type MagSinglePostProps = {
  category: string
  title: string
  image: string
  imageAlt?: string
  byline?: string
  avatar?: string
  homeHref?: string
  children: ReactNode
  sidebarTitle?: string
  sidebarItems: MagCardItem[]
}

export function MagSinglePost({
  category,
  title,
  image,
  imageAlt,
  byline,
  avatar,
  homeHref = '/',
  children,
  sidebarTitle = 'Latest Post',
  sidebarItems,
}: MagSinglePostProps) {
  const featured = sidebarItems[0]
  const rest = sidebarItems.slice(1, 4)

  return (
    <>
      <div className="mag-wrap mag-single">
        <article className="mag-single__main">
          <header className="mag-single__hero">
            <Image src={image} alt={imageAlt || title} fill priority sizes="(max-width: 980px) 100vw, 65vw" />
            <div className="mag-single__shade" />
            <div className="mag-single__hero-copy">
              <p className="mag-breadcrumb mag-single__crumbs">
                <Link href={homeHref}>Home</Link>
                <span aria-hidden>›</span>
                <span className="mag-chip">{category}</span>
              </p>
              <h1>{title}</h1>
              {byline ? (
                <div className="mag-hero__by">
                  {avatar ? <Image src={avatar} alt="" width={32} height={32} /> : null}
                  <span>{byline}</span>
                </div>
              ) : null}
            </div>
          </header>
          <div className="mag-single__body story-body story-detail-body">{children}</div>
        </article>

        <aside className="mag-single__side">
          <h2 className="mag-single__side-title">{sidebarTitle}</h2>
          {featured ? <MagCard item={featured} heading="h3" /> : null}
          {rest.length > 0 ? (
            <ul className="mag-side-list">
              {rest.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="mag-side-item">
                    <span className="mag-side-item__media">
                      <Image src={item.image} alt="" fill sizes="88px" />
                    </span>
                    <span>
                      <span className="mag-title mag-side-item__title">{item.title}</span>
                      {item.byline ? <span className="mag-meta">{item.byline}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>
      <MagNewsletter image={image || featured?.image || environmentImageForKey('single-newsletter')} />
    </>
  )
}
