import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CircleCheck } from 'lucide-react'
import { SiteNav } from '@/components/layout/SiteNav'
import { RichTextContent } from '@/components/content/RichTextContent'
import { lexicalToPlainText } from '@/lib/cms/richtext'
import type { ChangemakerProfile } from '@/lib/cms/organizations'

const COVER_FALLBACK = (slug: string) => `https://picsum.photos/seed/${slug}-cover/1600/480`
const LOGO_FALLBACK = (slug: string) => `https://picsum.photos/seed/${slug}-logo/240/240`

function formatOrgType(type: string): string {
  return type
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function metaLine(org: ChangemakerProfile): string | null {
  const parts = [org.hqLocation, formatOrgType(org.type)].filter(Boolean)
  return parts.length ? parts.join(' · ') : null
}

function hasBio(bio: unknown): boolean {
  return Boolean(lexicalToPlainText(bio))
}

function bioPlainText(bio: unknown): string | null {
  const text = lexicalToPlainText(bio)
  return text || null
}

function orgInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function ChangemakerProfileHeaderMobile({ org }: { org: ChangemakerProfile }) {
  const meta = metaLine(org)
  const bio = bioPlainText(org.bio)
  const hasCover = Boolean(org.coverUrl)
  const hasLogo = Boolean(org.logoUrl)

  return (
    <section className="changemaker-profile-mobile md:hidden" aria-label={`${org.name} profile`}>
      <div className="changemaker-profile-mobile__nav">
        <Link href="/solutions" className="changemaker-profile-mobile__back" aria-label="Browse the atlas">
          <ArrowLeft aria-hidden />
        </Link>
        <SiteNav variant="dark" activeLink="/solutions" />
      </div>

      <div className="changemaker-profile-mobile__cover">
        {hasCover ? (
          <Image
            src={org.coverUrl!}
            alt={`${org.name} cover`}
            fill
            className="changemaker-profile-mobile__cover-image"
            sizes="100vw"
            priority
          />
        ) : null}
      </div>

      <div className="changemaker-profile-mobile__body">
        <div className="changemaker-profile-mobile__logo">
          {hasLogo ? (
            <Image
              src={org.logoUrl!}
              alt={org.name}
              fill
              className="changemaker-profile-mobile__logo-image"
              sizes="74px"
              priority
            />
          ) : (
            <span className="changemaker-profile-mobile__logo-initial" aria-hidden>
              {orgInitial(org.name)}
            </span>
          )}
        </div>

        <h1 className="changemaker-profile-mobile__name">{org.name}</h1>

        {org.verified || meta ? (
          <div className="changemaker-profile-mobile__identity">
            {org.verified ? (
              <span className="changemaker-profile-mobile__verified">
                <CircleCheck className="changemaker-profile-mobile__verified-icon" aria-hidden />
                Verified
              </span>
            ) : null}
            {meta ? <span className="changemaker-profile-mobile__meta">{meta}</span> : null}
          </div>
        ) : null}

        {bio ? <p className="changemaker-profile-mobile__bio">{bio}</p> : null}

        {org.website ? (
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            className="changemaker-profile-mobile__cta"
          >
            Work with this organization
          </a>
        ) : null}
      </div>
    </section>
  )
}

function ChangemakerProfileHeaderDesktop({ org }: { org: ChangemakerProfile }) {
  const coverSrc = org.coverUrl || COVER_FALLBACK(org.slug)
  const logoSrc = org.logoUrl || LOGO_FALLBACK(org.slug)
  const meta = metaLine(org)
  const impactTiles = org.aggregateImpact.filter((tile) => tile.label && tile.value).slice(0, 3)

  return (
    <section className="changemaker-profile hidden bg-white md:block">
      <div className="changemaker-profile__hero">
        <div className="changemaker-profile__toolbar">
          <Link href="/solutions" className="changemaker-profile__back" aria-label="Browse the atlas">
            <ArrowLeft aria-hidden />
          </Link>
          <Link href="/changemakers" className="changemaker-profile__breadcrumb">
            Changemakers
          </Link>
          <SiteNav variant="light" activeLink="/solutions" />
        </div>

        <div className="changemaker-profile__cover-wrap">
          <div className="changemaker-profile__cover" aria-hidden>
            <Image
              src={coverSrc}
              alt=""
              fill
              className="changemaker-profile__cover-image"
              sizes="(max-width: 1280px) 100vw, 1152px"
              priority
            />
            <div className="changemaker-profile__cover-scrim" />
          </div>
        </div>

        <div className="changemaker-profile__panel">
          <div className="changemaker-profile__identity">
            <div className="changemaker-profile__logo">
              <Image
                src={logoSrc}
                alt=""
                fill
                className="changemaker-profile__logo-image"
                sizes="112px"
                priority
              />
            </div>

            <div className="changemaker-profile__details">
              <div className="changemaker-profile__title-row">
                <h1 className="changemaker-profile__name">{org.name}</h1>
                {org.verified ? (
                  <span className="changemaker-profile__verified">
                    <CircleCheck aria-hidden />
                    <span>Verified</span>
                  </span>
                ) : null}
              </div>

              {meta ? <p className="changemaker-profile__meta">{meta}</p> : null}
              {org.tagline ? <p className="changemaker-profile__tagline">{org.tagline}</p> : null}
            </div>

            {org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="changemaker-profile__cta"
              >
                Work with this org
              </a>
            ) : null}
          </div>

          {hasBio(org.bio) ? (
            <div className="changemaker-profile__bio-rich">
              <RichTextContent data={org.bio} className="changemaker-profile__bio-prose text-white/85" />
            </div>
          ) : null}
        </div>

        {impactTiles.length ? (
          <div
            className="changemaker-profile__stats"
            aria-label="Aggregate impact"
            style={{ gridTemplateColumns: `repeat(${impactTiles.length}, minmax(0, 1fr))` }}
          >
            {impactTiles.map((tile, index) => (
              <div
                key={`${tile.label}-${tile.value}`}
                className={`changemaker-profile__stat${index < impactTiles.length - 1 ? ' changemaker-profile__stat--divider' : ''}`}
              >
                <p className="changemaker-profile__stat-value">{tile.value}</p>
                <p className="changemaker-profile__stat-label">{tile.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function ChangemakerProfileHeader({ org }: { org: ChangemakerProfile }) {
  return (
    <>
      <ChangemakerProfileHeaderMobile org={org} />
      <ChangemakerProfileHeaderDesktop org={org} />
    </>
  )
}
