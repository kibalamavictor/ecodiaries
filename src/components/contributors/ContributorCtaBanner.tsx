import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'
import type { Contributor } from '@/lib/contributors/types'

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function pickAvatarContributors(contributors: Contributor[]): Contributor[] {
  if (!contributors.length) return []

  const withAvatar = contributors.filter((contributor) => contributor.avatarUrl)
  const withoutAvatar = contributors.filter((contributor) => !contributor.avatarUrl)
  return [...withAvatar, ...withoutAvatar].slice(0, 3)
}

function proofLine(count: number): string {
  if (count === 1) return '1 contributor already sharing stories'
  return `${count}+ contributors already sharing stories`
}

type ContributorCtaBannerProps = {
  contributors: Contributor[]
}

export function ContributorCtaBanner({ contributors }: ContributorCtaBannerProps) {
  const sample = pickAvatarContributors(contributors)
  const count = contributors.length

  return (
    <section className="contributor-cta-banner bg-brand-green text-white">
      {/* Mobile — compact proof-driven card */}
      <div className="contributor-cta-banner__mobile mx-auto max-w-6xl px-4 sm:px-6 md:hidden">
        <p className="contributor-cta-banner__eyebrow">Voices from the ground</p>
        <h2 className="contributor-cta-banner__headline">Want to be featured here?</h2>

        {count > 0 ? (
          <div className="contributor-cta-banner__proof">
            {sample.length ? (
              <ul className="contributor-cta-banner__avatars" aria-hidden>
                {sample.map((contributor) => (
                  <li key={contributor.id} className="contributor-cta-banner__avatar">
                    {contributor.avatarUrl ? (
                      <Image
                        src={contributor.avatarUrl}
                        alt=""
                        width={36}
                        height={36}
                        className="contributor-cta-banner__avatar-image"
                      />
                    ) : (
                      <span className="contributor-cta-banner__avatar-initials">{initials(contributor.name)}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="contributor-cta-banner__proof-text">{proofLine(count)}</p>
          </div>
        ) : null}

        <ContributorsApplyLink className="contributor-cta-banner__btn">
          Apply now
          <ArrowRight className="contributor-cta-banner__btn-icon" aria-hidden />
        </ContributorsApplyLink>
      </div>

      {/* Desktop — unchanged */}
      <div className="mx-auto hidden max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex md:flex-row md:items-center md:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-lime">Voices from the ground</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Want to be featured here? Apply to contribute.</h2>
          <p className="mt-2 max-w-xl text-white/85">
            EcoDiaries amplifies young storytellers, community reporters, and environmental advocates.
          </p>
        </div>
        <ContributorsApplyLink className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-forest transition hover:brightness-95">
          Apply now <span aria-hidden>→</span>
        </ContributorsApplyLink>
      </div>
    </section>
  )
}
