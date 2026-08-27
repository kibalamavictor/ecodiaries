export function normalizeApplicationUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

export function hasExternalApplication(applicationUrl: string | null | undefined): boolean {
  return normalizeApplicationUrl(applicationUrl) !== null
}
