'use client'

import { Share2 } from 'lucide-react'
import { useCallback } from 'react'

type StoryShareBarProps = {
  title?: string
  text?: string
}

function canUseNativeShare(data: ShareData): boolean {
  if (typeof navigator === 'undefined' || !('share' in navigator)) return false
  if (typeof navigator.canShare === 'function') {
    try {
      return navigator.canShare(data)
    } catch {
      return false
    }
  }
  return true
}

async function fallbackCopy(url: string) {
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    window.prompt('Copy this link:', url)
  }
}

export function StoryShareBar({ title, text }: StoryShareBarProps) {
  const handleShare = useCallback(() => {
    const url = window.location.href
    const shareData: ShareData = {
      title: title || document.title,
      url,
      ...(text ? { text } : {}),
    }

    if (canUseNativeShare(shareData)) {
      // Must run synchronously from the tap — no await before share().
      navigator.share(shareData).catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        void fallbackCopy(url)
      })
      return
    }

    void fallbackCopy(url)
  }, [title, text])

  return (
    <button type="button" className="story-article-share" onClick={handleShare} aria-label="Share article">
      <Share2 className="story-article-share__icon" strokeWidth={2} aria-hidden />
    </button>
  )
}
