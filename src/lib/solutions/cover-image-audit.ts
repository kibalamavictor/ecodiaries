/** Heuristic flags for cover images that are likely stock placeholders, not field photos. */
const STOCK_IMAGE_HOSTS = ['images.unsplash.com', 'source.unsplash.com', 'plus.unsplash.com', 'picsum.photos']

export function isLikelyStockCoverImage(url?: string | null): boolean {
  if (!url?.trim()) return false

  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return STOCK_IMAGE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export function stockCoverImageMessage(): string {
  return 'Placeholder photo — replace with a real, project-specific image before sharing this page publicly.'
}
