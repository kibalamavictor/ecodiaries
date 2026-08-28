import type { SolutionStatus } from '@/lib/solutions/types'

/**
 * Shared stage colour map — use everywhere a project stage appears
 * (solution cards, atlas list, detail pages, map popovers).
 */
export const stageColorMap: Record<SolutionStatus, string> = {
  piloted: 'bg-[#f3f3f3] text-[#1a1a1a]',
  scaling: 'bg-[#0B3E1F] text-white',
  established: 'bg-[#1a1a1a] text-white',
}

/** @deprecated Use stageColorMap */
export const STATUS_PILL_CLASSES = stageColorMap
