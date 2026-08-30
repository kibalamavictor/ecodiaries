import Image from 'next/image'
import { MobileCardText } from '@/components/mobile/MobileCardText'

export type CommunityProject = {
  title: string
  excerpt: string
  image: string
}

export function CommunityProjectCard({ project }: { project: CommunityProject }) {
  return (
    <article className="story-card mobile-scroll-card">
      <div className="mobile-scroll-card__media story-thumb">
        <Image
          src={project.image}
          alt=""
          fill
          className="story-thumb__image"
          sizes="(max-width: 767px) 82vw, 25vw"
        />
      </div>
      <MobileCardText title={project.title} description={project.excerpt} />
    </article>
  )
}
