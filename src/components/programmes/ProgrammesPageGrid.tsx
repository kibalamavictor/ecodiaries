'use client'

import { ProgrammesGridDesktop } from '@/components/programmes/ProgrammesGridDesktop'
import type { Programme } from '@/lib/programmes/types'

type ProgrammesPageGridProps = {
  programmes: Programme[]
}

export function ProgrammesPageGrid({ programmes }: ProgrammesPageGridProps) {
  return <ProgrammesGridDesktop programmes={programmes} />
}
