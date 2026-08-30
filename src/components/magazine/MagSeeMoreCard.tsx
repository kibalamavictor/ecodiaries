import Image from 'next/image'
import Link from 'next/link'

type MagSeeMoreCardProps = {
  href: string
  label: string
  subtitle: string
  images?: string[]
}

export function MagSeeMoreCard({ href, label, subtitle, images = [] }: MagSeeMoreCardProps) {
  const collage = images.filter(Boolean).slice(0, 2)

  return (
    <Link href={href} className="article-card article-card--more">
      <span className="article-card__media" aria-hidden>
        {collage.length ? (
          <span className={`article-card__collage${collage.length === 1 ? ' article-card__collage--single' : ''}`}>
            {collage.map((src) => (
              <span key={src} className="article-card__collage-cell">
                <Image src={src} alt="" fill sizes="35vw" />
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span className="article-card__body">
        <span className="article-card__title">{label}</span>
        <span className="article-card__meta">{subtitle}</span>
      </span>
    </Link>
  )
}
