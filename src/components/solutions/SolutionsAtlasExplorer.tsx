'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AtlasExplorer } from '@/components/solutions/atlas/AtlasExplorer'
import { AtlasExplorerDesktop } from '@/components/solutions/atlas/AtlasExplorerDesktop'
import { SolutionsMobileGrid } from '@/components/solutions/mobile/SolutionsMobileGrid'
import { useIsMdViewport } from '@/lib/hooks/use-is-md-viewport'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsAtlasExplorerProps = {
  projects: AtlasProject[]
}

function MobileSolutionsExplorer({ projects }: { projects: AtlasProject[] }) {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') === 'atlas' ? 'atlas' : 'grid'

  if (view === 'atlas') {
    return <AtlasExplorer projects={projects} />
  }

  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-neutral-600">Loading solutions…</div>}>
      <SolutionsMobileGrid projects={projects} />
    </Suspense>
  )
}

export function SolutionsAtlasExplorer({ projects }: SolutionsAtlasExplorerProps) {
  const isMd = useIsMdViewport()

  if (isMd) {
    return <AtlasExplorerDesktop projects={projects} />
  }

  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-neutral-600">Loading solutions…</div>}>
      <MobileSolutionsExplorer projects={projects} />
    </Suspense>
  )
}
