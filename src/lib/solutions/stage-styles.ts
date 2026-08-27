import type { SolutionStatus } from '@/lib/solutions/types'

/**
 * Shared stage colour map — use everywhere a project stage appears
 * (solution cards, atlas list, detail pages, map popovers).
 */
export const stageColorMap: Record<SolutionStatus, string> = {
  piloted: 'bg-[#FFE44D] text-[#070D02]',
  scaling: 'bg-[#B6F101] text-[#070D02]',
  established: 'bg-[#0B3E1F] text-white',
}

/** @deprecated Use stageColorMap */
export const STATUS_PILL_CLASSES = stageColorMap
