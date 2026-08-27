'use client'

import { useSyncExternalStore } from 'react'

const MD_QUERY = '(min-width: 768px)'

function subscribeMd(onChange: () => void) {
  const mq = window.matchMedia(MD_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getMdSnapshot() {
  return window.matchMedia(MD_QUERY).matches
}

/** True at the `md` breakpoint and above (768px). SSR defaults to false (mobile). */
export function useIsMdViewport() {
  return useSyncExternalStore(subscribeMd, getMdSnapshot, () => false)
}
