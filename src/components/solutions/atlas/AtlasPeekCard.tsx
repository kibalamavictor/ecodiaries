import Image from 'next/image'
import Link from 'next/link'
import { StagePill } from '@/components/solutions/StagePill'
import type { AtlasProject } from '@/lib/solutions/types'

export function AtlasPeekCard({ project, onClose }: { project: AtlasProject; onClose: () => void }) {
  return (
    <div className="atlas-peek">
      <div className="atlas-peek__media">
        <Image src={project.coverImageUrl} alt="" fill className="object-cover" sizes="400px" />
        <button type="button" className="atlas-peek__close" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="atlas-peek__body">
        <span className="mag-chip">{project.organization?.name || 'Field project'}</span>
        <h3 className="mag-title atlas-peek__title">{project.title}</h3>
        <p className="mag-excerpt atlas-peek__excerpt">{project.summary}</p>
        <div className="atlas-peek__actions">
          <StagePill status={project.status} />
          <Link href={`/solutions/${project.slug}`} className="mag-link">
            View solution →
          </Link>
        </div>
      </div>
    </div>
  )
}
