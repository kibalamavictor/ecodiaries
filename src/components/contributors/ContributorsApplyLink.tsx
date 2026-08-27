'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'

const APPLY_SECTION_ID = 'apply'
const APPLY_HREF = '/contributors#apply'

type ContributorsApplyLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  children: ReactNode
}

export function scrollToApplySection(behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(APPLY_SECTION_ID)
  if (!target) return false
  target.scrollIntoView({ behavior, block: 'start' })
  return true
}

export function ContributorsApplyLink({ children, onClick, ...props }: ContributorsApplyLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      href={APPLY_HREF}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        if (pathname === '/contributors') {
          event.preventDefault()
          scrollToApplySection()
          window.history.pushState(null, '', APPLY_HREF)
        }
      }}
    >
      {children}
    </Link>
  )
}
