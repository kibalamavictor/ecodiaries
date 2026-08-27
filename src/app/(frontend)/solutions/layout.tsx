import './solutions.css'
import type { ReactNode } from 'react'
import { SolutionsLayoutGroup } from '@/components/solutions/SolutionsLayoutGroup'

export default function SolutionsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="solutions-tailwind min-h-screen bg-white text-neutral-900">
      <SolutionsLayoutGroup>{children}</SolutionsLayoutGroup>
    </div>
  )
}
