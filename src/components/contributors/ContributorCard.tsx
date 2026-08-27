import Image from 'next/image'
import { Globe, Mail } from 'lucide-react'
import type { Contributor } from '@/lib/contributors/types'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.3" />
      <circle cx="16.6" cy="7.4" r=".6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

type ContributorCardProps = {
  contributor: Contributor
  compact?: boolean
}

function ContributorCardDesktop({ contributor }: { contributor: Contributor }) {
  const categoryLabel =
    contributor.categories[0]?.charAt(0).toUpperCase() + contributor.categories[0]?.slice(1) || 'Contributor'

  return (
    <article className="flex flex-col items-center text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-full border border-border bg-muted">
        {contributor.avatarUrl ? (
          <Image
            src={contributor.avatarUrl}
            alt={contributor.name}
            fill
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover object-center"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-brand-green text-2xl font-bold text-white">
            {initials(contributor.name)}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold text-brand-forest">{contributor.name}</h3>
      <span className="mt-1 inline-flex rounded-full bg-brand-lime/10 px-3 py-1 text-xs font-semibold text-brand-forest">
        {categoryLabel}
      </span>
      <p className="mt-2 text-sm text-neutral-600">{contributor.primaryRole}</p>
      <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{contributor.bio}</p>

      {contributor.links ? (
        <div className="mt-3 flex items-center gap-3 text-brand-forest">
          {contributor.links.instagram ? (
            <a href={contributor.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </a>
          ) : null}
          {contributor.links.twitter ? (
            <a href={contributor.links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <XIcon className="h-4 w-4" />
            </a>
          ) : null}
          {contributor.links.website ? (
            <a href={contributor.links.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
              <Globe className="h-4 w-4" />
            </a>
          ) : null}
          {contributor.links.email ? (
            <a href={`mailto:${contributor.links.email}`} aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

function ContributorCardMobile({ contributor }: { contributor: Contributor }) {
  const categoryLabel =
    contributor.categories[0]?.charAt(0).toUpperCase() + contributor.categories[0]?.slice(1) || 'Contributor'

  return (
    <article className="contributor-card contributor-card--compact">
      <div className="contributor-card__inner">
        <div className="contributor-card__avatar">
          {contributor.avatarUrl ? (
            <Image
              src={contributor.avatarUrl}
              alt={contributor.name}
              fill
              loading="lazy"
              decoding="async"
              sizes="44vw"
              className="object-cover object-center"
            />
          ) : (
            <span className="contributor-card__initials">{initials(contributor.name)}</span>
          )}
        </div>

        <h3 className="contributor-card__name">{contributor.name}</h3>
        <span className="contributor-card__pill">{categoryLabel}</span>
        {contributor.region ? <p className="contributor-card__location">{contributor.region}</p> : null}
      </div>
    </article>
  )
}

export function ContributorCard({ contributor, compact = false }: ContributorCardProps) {
  if (compact) {
    return <ContributorCardMobile contributor={contributor} />
  }

  return <ContributorCardDesktop contributor={contributor} />
}
