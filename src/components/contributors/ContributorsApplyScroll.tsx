'use client'

import { useEffect } from 'react'
import { scrollToApplySection } from '@/components/contributors/ContributorsApplyLink'

/** Scrolls to #apply after client navigation (Next.js does not do this by default). */
export function ContributorsApplyScroll() {
  useEffect(() => {
    function tryScroll(attempt = 0) {
      if (window.location.hash !== '#apply') return
      const scrolled = scrollToApplySection(attempt === 0 ? 'smooth' : 'auto')
      if (!scrolled && attempt < 12) {
        window.setTimeout(() => tryScroll(attempt + 1), 100)
      }
    }

    tryScroll()

    const onHashChange = () => tryScroll()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return null
}
