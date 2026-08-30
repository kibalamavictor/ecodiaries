import { cn } from '@/lib/utils'
import { hasStackedGallery } from '@/lib/solutions/gallery'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionMediaStackProps = {
  project: Pick<AtlasProject, 'coverImageUrl' | 'gallery'>
  variant?: 'spotlight' | 'grid'
  className?: string
}

export function SolutionMediaStack({ project, variant = 'grid', className }: SolutionMediaStackProps) {
  if (!hasStackedGallery(project)) return null

  const layerClass =
    variant === 'spotlight'
      ? 'solutions-media-stack__layer solutions-media-stack__layer--spotlight'
      : 'solutions-media-stack__layer solutions-media-stack__layer--grid'

  return (
    <div className={cn('solutions-media-stack', className)} aria-hidden>
      <span className={cn(layerClass, 'solutions-media-stack__layer--back')} />
      <span className={cn(layerClass, 'solutions-media-stack__layer--mid')} />
    </div>
  )
}
