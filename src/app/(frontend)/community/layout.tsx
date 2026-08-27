import '../contributors/contributors.css'
import '../opportunities/opportunities.css'
import '../solutions/solutions.css'
import './community.css'
import type { ReactNode } from 'react'

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="contributors-tailwind programmes-tailwind">{children}</div>
}
