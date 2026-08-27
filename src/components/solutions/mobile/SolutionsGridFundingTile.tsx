import Link from 'next/link'
import { uniqueCountriesCount } from '@/lib/solutions/coordinates'
import type { AtlasProject } from '@/lib/solutions/types'

type SolutionsGridFundingTileProps = {
  projectCount: number
  projects: AtlasProject[]
}

export function SolutionsGridFundingTile({ projectCount, projects }: SolutionsGridFundingTileProps) {
  const countryCount = uniqueCountriesCount(projects)

  return (
    <article className="solutions-grid-funding-tile">
      <p className="solutions-grid-funding-tile__eyebrow">Partnership</p>
      <p className="solutions-grid-funding-tile__proof">
        {projectCount} project{projectCount === 1 ? '' : 's'} already reaching funders in {countryCount}{' '}
        {countryCount === 1 ? 'country' : 'countries'}
      </p>
      <Link href="/contact?reason=partnership&topic=atlas" className="solutions-grid-funding-tile__submit">
        Submit
      </Link>
    </article>
  )
}
