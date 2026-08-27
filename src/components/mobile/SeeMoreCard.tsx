import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface SeeMoreCardProps {
  label: string
  countText: string
  href: string
  images: string[]
}

export function SeeMoreCard({ label, countText, href, images }: SeeMoreCardProps) {
  const collage = images.length ? images.slice(0, 2) : [null, null]

  return (
    <Link
      href={href}
      className="mobile-scroll-card flex flex-col overflow-hidden rounded-2xl bg-brand-forest"
    >
      <div className="mobile-scroll-card__media relative grid grid-cols-2 grid-rows-1">
        {collage.map((src, i) => (
          <div key={i} className="relative overflow-hidden bg-brand-forest">
            {src ? (
              <Image
                src={src}
                alt=""
                fill
                className="object-cover object-center opacity-70"
                sizes="(max-width: 767px) 40vw, 160px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-green/30">
                <span className="font-heading text-xs font-bold text-brand-lime">E</span>
              </div>
            )}
          </div>
        ))}
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-brand-lime px-2.5 py-1 text-[10px] font-semibold text-brand-forest">
          Explore
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      <div className="mobile-scroll-card__text mobile-scroll-card__text--on-dark">
        <div className="mobile-scroll-card__head">
          <p className="mobile-scroll-card__title">{countText}</p>
          <p className="mobile-scroll-card__desc mobile-scroll-card__eyebrow">{label}</p>
        </div>
        <div className="mobile-scroll-card__meta-slot" aria-hidden="true" />
      </div>
    </Link>
  )
}
