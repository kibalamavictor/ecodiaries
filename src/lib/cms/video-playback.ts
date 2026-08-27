type MediaLike = { url?: string | null; mimeType?: string | null }

function withProtocol(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url.replace(/^\/+/, '')}`
}

function extractYoutubeId(pathname: string, searchParams: URLSearchParams): string | null {
  const fromQuery = searchParams.get('v')
  if (fromQuery) return fromQuery

  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'embed' && parts[1]) return parts[1]
  if (parts[0] === 'shorts' && parts[1]) return parts[1]
  if (parts[0] === 'live' && parts[1]) return parts[1]
  if (parts[0] === 'v' && parts[1]) return parts[1]
  return null
}

/** Normalize watch/listen URLs to iframe-safe embed src (YouTube, Vimeo). */
export function normalizeEmbedUrl(url?: string | null): string | null {
  if (!url?.trim()) return null

  let raw = url.trim()
  const iframeSrc = raw.match(/src=["']([^"']+)["']/i)?.[1]
  if (iframeSrc) raw = iframeSrc.trim()

  raw = withProtocol(raw)

  try {
    const parsed = new URL(raw)
    const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '')

    if (host === 'youtube.com' || host === 'music.youtube.com') {
      const id = extractYoutubeId(parsed.pathname, parsed.searchParams)
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }

    if (host === 'player.vimeo.com') return raw
  } catch {
    return null
  }

  if (/youtube\.com\/embed\//i.test(raw) || /player\.vimeo\.com\/video\//i.test(raw)) {
    return raw
  }

  return null
}

export function resolveVideoFileUrl(media: number | MediaLike | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  if (!media.url) return null
  if (media.mimeType?.startsWith('image/')) return null
  if (media.mimeType && !media.mimeType.startsWith('video/')) return null
  return media.url
}

export function resolvePlaybackSource({
  videoFile,
  embedUrl,
}: {
  videoFile?: number | MediaLike | null
  embedUrl?: string | null
}): { kind: 'file'; src: string } | { kind: 'embed'; src: string } | null {
  // Prefer an explicit embed link when present — Studio editors often paste YouTube after skipping file upload.
  const embedSrc = normalizeEmbedUrl(embedUrl)
  if (embedSrc) return { kind: 'embed', src: embedSrc }

  const fileSrc = resolveVideoFileUrl(videoFile)
  if (fileSrc) return { kind: 'file', src: fileSrc }

  return null
}
