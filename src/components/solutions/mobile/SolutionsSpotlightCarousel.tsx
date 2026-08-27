import { SolutionsSpotlightCard } from '@/components/solutions/mobile/SolutionsSpotlightCard'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsSpotlightCarouselProps = {
  projects: AtlasProject[]
}

export function SolutionsSpotlightCarousel({ projects }: SolutionsSpotlightCarouselProps) {
  if (!projects.length) return null

  return (
    <section className="solutions-spotlight-carousel" aria-label="Spotlight solutions">
      <h3 className="solutions-spotlight-carousel__title">Spotlight</h3>
      <div
        className="solutions-spotlight-carousel__scroll scroll-edge-fade scrollbar-hide"
        aria-roledescription="carousel"
      >
        {projects.map((project) => (
          <div key={project.id} className="solutions-spotlight-carousel__item">
            <SolutionsSpotlightCard project={project} />
          </div>
        ))}
      </div>
    </section>
  )
}
