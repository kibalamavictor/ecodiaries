'use client'

import { useEffect } from 'react'

export function ClientEnhancements() {
  useEffect(() => {
    document.querySelectorAll('.play-btn, .ep-play').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const el = btn as HTMLElement
        el.style.transform = (el.style.transform || '') + ' scale(0.92)'
        window.setTimeout(() => {
          el.style.transform = el.style.transform.replace(' scale(0.92)', '')
        }, 150)
      })
    })
  }, [])

  return null
}
