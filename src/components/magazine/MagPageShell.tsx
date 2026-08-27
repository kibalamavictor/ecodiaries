import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteNav } from '@/components/layout/SiteNav'

export function MagPageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="magazine">{children}</main>
      <SiteFooter />
    </>
  )
}
