'use client'

import { LayoutGroup } from 'framer-motion'
import type { ReactNode } from 'react'

export function SolutionsLayoutGroup({ children }: { children: ReactNode }) {
  return <LayoutGroup id="solutions-atlas">{children}</LayoutGroup>
}
