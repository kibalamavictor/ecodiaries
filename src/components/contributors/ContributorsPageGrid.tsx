'use client'

import { ContributorsGridDesktop } from '@/components/contributors/ContributorsGridDesktop'
import type { Contributor } from '@/lib/contributors/types'

type ContributorsPageGridProps = {
  contributors: Contributor[]
}

export function ContributorsPageGrid({ contributors }: ContributorsPageGridProps) {
  return <ContributorsGridDesktop contributors={contributors} />
}
