import { uniqueCountriesCount } from '@/lib/solutions/coordinates'
import type { Solution } from '@/lib/solutions/types'

type SolutionsStatsMarqueeProps = {
  solutions: Solution[]
}

function buildMarqueePhrase(solutions: Solution[]): string {
  const count = solutions.length
  const countries = uniqueCountriesCount(solutions)
  if (count > 0) {
    return `${count} solution${count === 1 ? '' : 's'} documented across ${countries} ${countries === 1 ? 'country' : 'countries'} — ready to scale in Africa`
  }
  return 'Climate solutions documented across Africa — ready to scale'
}

export function SolutionsStatsMarquee({ solutions }: SolutionsStatsMarqueeProps) {
  const phrase = buildMarqueePhrase(solutions)
  const half = Array.from({ length: 8 }, () => phrase)
  const track = [...half, ...half]

  return (
    <div className="solutions-stats-marquee" aria-label="Platform highlights">
      <div className="solutions-stats-marquee__track">
        {track.map((item, index) => (
          <span key={`${index}`} className="solutions-stats-marquee__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
