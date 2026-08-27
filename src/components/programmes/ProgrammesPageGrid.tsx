'use client'

import { ProgrammesGrid } from '@/components/programmes/ProgrammesGrid'
import { ProgrammesGridDesktop } from '@/components/programmes/ProgrammesGridDesktop'
import { useIsMdViewport } from '@/lib/hooks/use-is-md-viewport'
import type { Programme } from '@/lib/programmes/types'

type ProgrammesPageGridProps = {
  programmes: Programme[]
}

export function ProgrammesPageGrid({ programmes }: ProgrammesPageGridProps) {
  const isMd = useIsMdViewport()

  if (isMd) {
    return <ProgrammesGridDesktop programmes={programmes} />
  }

  return <ProgrammesGrid programmes={programmes} />
}
