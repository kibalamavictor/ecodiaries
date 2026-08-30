import Image from 'next/image'
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
    <section className="mag-cta-band">
      <div className="mag-wrap mag-two mag-two--center">
        <div>
          <p className="mag-news__eyebrow mag-cta-band__eyebrow">Voices from the ground</p>
          <h2>Want to be featured here?</h2>
          {count > 0 ? <p>{proofLine(count)}</p> : (
            <p>EcoDiaries amplifies young storytellers, community reporters, and environmental advocates.</p>
          )}
          <ContributorsApplyLink className="mag-btn mag-cta-band__btn">Apply now</ContributorsApplyLink>
        </div>
        {sample.length ? (
          <ul className="mag-tag-row" aria-hidden style={{ justifyContent: 'flex-end' }}>
            {sample.map((contributor) => (
              <li key={contributor.id} className="mag-profile-logo" style={{ width: 64, height: 64, borderRadius: 999 }}>
                {contributor.avatarUrl ? (
                  <Image src={contributor.avatarUrl} alt="" fill sizes="64px" />
                ) : (
                  <span>{initials(contributor.name)}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
