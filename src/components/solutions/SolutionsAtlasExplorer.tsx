import { SolutionsAtlasHero } from '@/components/solutions/atlas/SolutionsAtlasHero'
import { SolutionsCollections } from '@/components/solutions/SolutionsCollections'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsAtlasExplorerProps = {
  projects: AtlasProject[]
  query?: string
  sector?: string
}

export function SolutionsAtlasExplorer({ projects, query, sector }: SolutionsAtlasExplorerProps) {
  return (
    <>
      <SolutionsAtlasHero projects={projects} />
      <SolutionsCollections projects={projects} query={query} sector={sector} />
    </>
  )
}
