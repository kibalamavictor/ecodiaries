import type { PodcastHost } from '@/lib/cms/podcast-types'

export function formatHostedByLabel(hosts: PodcastHost[]): string {
  if (!hosts.length) return ''
  const names = hosts.map((host) => host.name.split(' ')[0] || host.name)
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} & ${names[1]}`
  return `${names[0]}, ${names[1]} & ${names.length - 2} more`
}
