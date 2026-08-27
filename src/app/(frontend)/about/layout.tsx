import './about.css'
import type { ReactNode } from 'react'

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <div className="about-page">{children}</div>
}
