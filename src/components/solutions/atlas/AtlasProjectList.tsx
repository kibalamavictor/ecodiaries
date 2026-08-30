import Image from 'next/image'
import { StagePill } from '@/components/solutions/StagePill'
import type { AtlasProject } from '@/lib/solutions/types'

type AtlasProjectListProps = {
  projects: AtlasProject[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onSelect: (project: AtlasProject) => void
}

export function AtlasProjectList({ projects, hoveredId, onHover, onSelect }: AtlasProjectListProps) {
  if (!projects.length) {
    return <p className="atlas-list-empty">No projects match these filters.</p>
  }

  return (
    <ul className="atlas-list">
      {projects.map((project) => (
        <li key={project.id}>
          <button
            type="button"
            className={`atlas-list-card ${hoveredId === project.id ? 'is-active' : ''}`}
            onMouseEnter={() => onHover(project.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(project)}
          >
            <div className="atlas-list-card__media">
              <Image src={project.coverImageUrl} alt="" fill className="object-cover" sizes="88px" />
            </div>
            <div className="atlas-list-card__copy">
              <div className="atlas-list-card__meta">
                <span className="atlas-org-label">{project.organization?.name || 'Field project'}</span>
                <StagePill status={project.status} />
              </div>
              <p className="atlas-list-card__title">{project.title}</p>
              <p className="atlas-list-card__summary">{project.summary}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
