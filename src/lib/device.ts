const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i

/** Server-side hint: prefer mobile layout on phones/tablets in portrait UA strings. */
export function isMobileUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true
  return MOBILE_UA.test(userAgent)
}
