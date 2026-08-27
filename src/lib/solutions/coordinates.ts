/** Approximate centroids for region/country strings used in seed and CMS data. */
const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  kenya: { lat: -0.02, lng: 37.9 },
  ethiopia: { lat: 9.0, lng: 38.7 },
  rwanda: { lat: -1.94, lng: 29.87 },
  ghana: { lat: 7.95, lng: -1.02 },
  nigeria: { lat: 9.08, lng: 8.68 },
  uganda: { lat: 1.37, lng: 32.29 },
  tanzania: { lat: -6.37, lng: 34.89 },
  senegal: { lat: 14.5, lng: -14.45 },
  niger: { lat: 17.61, lng: 8.08 },
  mali: { lat: 17.57, lng: -4.0 },
  'south africa': { lat: -30.56, lng: 22.94 },
  'east africa': { lat: 0.5, lng: 36.0 },
  'west africa': { lat: 10.0, lng: -5.0 },
  sahel: { lat: 14.0, lng: 0.0 },
  'horn of africa': { lat: 8.0, lng: 42.0 },
  'lake victoria': { lat: -1.0, lng: 33.0 },
  kampala: { lat: 0.35, lng: 32.58 },
  lagos: { lat: 6.52, lng: 3.38 },
  nairobi: { lat: -1.29, lng: 36.82 },
  india: { lat: 20.59, lng: 78.96 },
  brazil: { lat: -14.24, lng: -51.93 },
  indonesia: { lat: -0.79, lng: 113.92 },
  'latin america': { lat: -8.78, lng: -55.79 },
  'southeast asia': { lat: 3.2, lng: 117.7 },
  europe: { lat: 50.85, lng: 10.45 },
}

function formatRegionLabel(key: string): string {
  return key
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const AFRICA_REGION_KEYS = [
  'east africa',
  'west africa',
  'horn of africa',
  'sahel',
  'kenya',
  'ethiopia',
  'rwanda',
  'ghana',
  'nigeria',
  'uganda',
  'tanzania',
  'senegal',
  'niger',
  'mali',
  'south africa',
  'lake victoria',
  'kampala',
  'lagos',
  'nairobi',
]

const GLOBAL_SCOPE_KEYS = ['global', 'india', 'latin america', 'southeast asia', 'brazil', 'indonesia']

export const AFRICA_REGION_OPTIONS = AFRICA_REGION_KEYS.map((key) => formatRegionLabel(key)).sort()

export const GLOBAL_SCOPE_OPTIONS = GLOBAL_SCOPE_KEYS.map((key) => formatRegionLabel(key))

/** @deprecated use AFRICA_REGION_OPTIONS */
export const GLOBAL_REGION_OPTIONS = AFRICA_REGION_OPTIONS

export const ATLAS_REGION_FILTER_OPTIONS = {
  africa: AFRICA_REGION_OPTIONS,
  global: GLOBAL_SCOPE_OPTIONS,
}

export function regionMatches(solutionRegion: string, filterRegion: string): boolean {
  if (filterRegion === 'all') return true
  const normalizedSolution = solutionRegion.toLowerCase().trim()
  const normalizedFilter = filterRegion.toLowerCase().trim()
  if (!normalizedSolution || !normalizedFilter) return false
  return normalizedSolution.includes(normalizedFilter) || normalizedFilter.includes(normalizedSolution)
}

export function projectMatchesRegionFilter(
  project: {
    region: string
    country?: string
    replicationScope?: 'africa' | 'global'
  },
  filterRegion: string,
): boolean {
  if (filterRegion === 'all') return true

  const filter = filterRegion.toLowerCase().trim()
  const isGlobalScopeFilter = GLOBAL_SCOPE_KEYS.some((key) => key === filter || filter.includes(key))

  if (filter === 'global') {
    return project.replicationScope === 'global'
  }

  if (isGlobalScopeFilter) {
    if (project.replicationScope !== 'global') return false
    return (
      regionMatches(project.region, filterRegion) ||
      (project.country ? regionMatches(project.country, filterRegion) : false)
    )
  }

  if (project.replicationScope === 'global') return false

  return (
    regionMatches(project.region, filterRegion) ||
    (project.country ? regionMatches(project.country, filterRegion) : false)
  )
}

export function coordinatesForRegion(region?: string | null): { lat: number; lng: number } {
  if (!region) return { lat: 0.5, lng: 20.0 }
  const key = region.toLowerCase().trim()
  for (const [name, coords] of Object.entries(REGION_COORDINATES)) {
    if (key.includes(name)) return coords
  }
  return { lat: 0.5, lng: 20.0 }
}

export function uniqueRegions(solutions: { region: string }[]): string[] {
  return [...new Set(solutions.map((s) => s.region).filter(Boolean))].sort()
}

export function uniqueCountriesCount(solutions: { region: string }[]): number {
  return uniqueRegions(solutions).length
}
