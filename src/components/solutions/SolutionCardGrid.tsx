import { MagCard } from '@/components/magazine/MagCard'
import { atlasProjectToMagCard } from '@/lib/magazine'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionCardGridProps = {
  projects: AtlasProject[]
  layout?: 'three' | 'inspire'
  chip?: 'overlay' | 'below'
}

export function SolutionCardGrid({
  projects,
  layout = 'three',
  chip = 'below',
}: SolutionCardGridProps) {
  if (!projects.length) return null

  if (layout === 'inspire') {
    return (
      <div className="mag-inspire__grid">
        {projects.map((project, index) => (
          <MagCard
            key={project.id}
            item={atlasProjectToMagCard(project)}
            size={index === 0 ? 'lg' : 'sm'}
            heading="h3"
            chip={chip}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mag-latest__grid">
      {projects.map((project) => (
        <MagCard
          key={project.id}
          item={atlasProjectToMagCard(project)}
          heading="h3"
          chip={chip}
        />
      ))}
    </div>
  )
}
