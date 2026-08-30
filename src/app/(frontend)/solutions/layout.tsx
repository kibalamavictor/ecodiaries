import './solutions.css'
import type { ReactNode } from 'react'

export default function SolutionsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="solutions-tailwind min-h-screen bg-white text-neutral-900">
      <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
      {children}
    </div>
  )
}
