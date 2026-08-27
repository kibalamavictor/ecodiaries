import Link from 'next/link'
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
      <div className="mt-10 text-center">
        <Link
          href="/contributors"
          className="inline-flex items-center rounded-full border border-brand-forest px-5 py-2.5 text-sm font-semibold text-brand-forest transition hover:bg-brand-lime/10"
        >
          View all contributors
        </Link>
      </div>
    </div>
  )
}
