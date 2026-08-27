import { ContributorCard } from '@/components/contributors/ContributorCard'
import type { Contributor } from '@/lib/contributors/types'

export function FeaturedContributors({ contributors }: { contributors: Contributor[] }) {
  if (!contributors.length) return null

  return (
    <div className="contributors-tailwind">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {contributors.map((contributor) => (
          <ContributorCard key={contributor.id} contributor={contributor} />
        ))}
      </div>
    </div>
  )
}
