import Link from 'next/link'
import { uniqueCountriesCount } from '@/lib/solutions/coordinates'
import type { Solution } from '@/lib/solutions/types'

type CredibilityStripProps = {
  solutions: Solution[]
}

export function CredibilityStrip({ solutions }: CredibilityStripProps) {
  const fieldReported = solutions.filter((s) => s.verifiedBy === 'field-reporter').length
  const countries = uniqueCountriesCount(solutions)

  return (
    <div className="solutions-metrics">
      <div className="mag-stat-row">
        <div>
          <p className="num">{solutions.length}</p>
          <p className="label">Solutions mapped</p>
        </div>
        <div>
          <p className="num">{countries}</p>
          <p className="label">{countries === 1 ? 'Country' : 'Countries'}</p>
        </div>
        <div>
          <p className="num">{fieldReported || solutions.length}</p>
          <p className="label">Field-reported</p>
        </div>
      </div>
      <p className="solutions-metrics__note">
        <Link href="/contact" className="mag-link">
          Verification methodology →
        </Link>
      </p>
    </div>
  )
}
