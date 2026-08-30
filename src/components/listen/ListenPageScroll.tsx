'use client'

import { useEffect } from 'react'

type ListenPageScrollProps = {
  episodeSlugs: string[]
}

function scrollToListenTarget(episodeSlugs: string[]) {
  const hash = window.location.hash.replace('#', '')

  if (hash === 'listen-series') {
    document.getElementById('listen-series')?.scrollIntoView({ behavior: 'auto', block: 'start' })
    return
  }

  if (hash && episodeSlugs.includes(hash)) {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    return
  }

  document.getElementById('listen-main')?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

export function ListenPageScroll({ episodeSlugs }: ListenPageScrollProps) {
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => scrollToListenTarget(episodeSlugs))
    return () => window.cancelAnimationFrame(frame)
  }, [episodeSlugs])

  useEffect(() => {
    function onHashChange() {
      scrollToListenTarget(episodeSlugs)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [episodeSlugs])

  return null
}
