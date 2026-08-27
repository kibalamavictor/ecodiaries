import Image from 'next/image'
import type { PodcastHost } from '@/lib/cms/podcast-types'

export function PodcasterCard({ host }: { host: PodcastHost }) {
  return (
    <article className="podcaster-card">
      <div className="podcaster-card__avatar">
        {host.avatar ? (
          <Image src={host.avatar} alt="" width={64} height={64} />
        ) : (
          <span className="podcaster-card__fallback" aria-hidden>
            {host.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="podcaster-card__body">
        <div className="podcaster-card__head">
          <h3>{host.name}</h3>
          <span className="podcaster-card__role">{host.role}</span>
        </div>
        {host.bio ? <p className="podcaster-card__bio">{host.bio}</p> : null}
        {host.socialLinks.length > 0 ? (
          <ul className="podcaster-card__links">
            {host.socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
