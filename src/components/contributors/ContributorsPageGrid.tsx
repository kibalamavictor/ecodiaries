'use client'

import { ContributorsGrid } from '@/components/contributors/ContributorsGrid'
import { ContributorsGridDesktop } from '@/components/contributors/ContributorsGridDesktop'
import { useIsMdViewport } from '@/lib/hooks/use-is-md-viewport'
import type { Contributor } from '@/lib/contributors/types'

type ContributorsPageGridProps = {
  contributors: Contributor[]
}

export function ContributorsPageGrid({ contributors }: ContributorsPageGridProps) {
  const isMd = useIsMdViewport()

  if (isMd) {
    return <ContributorsGridDesktop contributors={contributors} />
  }

  return <ContributorsGrid contributors={contributors} />
}
