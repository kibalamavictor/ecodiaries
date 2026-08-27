'use client'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(name, props ? { props } : undefined)
  }
}

export function trackStoryRead(slug: string, title: string) {
  trackEvent('Story Read', { slug, title })
}
