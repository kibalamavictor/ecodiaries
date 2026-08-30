'use client'

import { useEffect } from 'react'
import { trackStoryRead } from '@/lib/analytics-client'

export function StoryReadTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    trackStoryRead(slug, title)
  }, [slug, title])

  return null
}
