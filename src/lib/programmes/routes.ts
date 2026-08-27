export const OPPORTUNITIES_PATH = '/opportunities'

export function opportunityDetailPath(slug: string): string {
  return `${OPPORTUNITIES_PATH}/${slug}`
}

export function opportunitiesListPath(query?: string): string {
  return query ? `${OPPORTUNITIES_PATH}?${query}` : OPPORTUNITIES_PATH
}
