import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export { CACHE_TAGS }

/** Next.js revalidation only works inside the app runtime — skip during seed/CLI. */
function safeRevalidate(fn: () => void) {
  try {
    fn()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('static generation store missing') || msg.includes('revalidatePath')) return
    throw err
  }
}

export function revalidateStories(slug?: string) {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.stories)
    revalidateTag(CACHE_TAGS.homepage)
    revalidatePath('/')
    revalidatePath('/stories')
    if (slug) revalidatePath(`/stories/${slug}`)
  })
}

export function revalidateSolutions(slug?: string) {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.solutions)
    revalidatePath('/solutions')
    if (slug) revalidatePath(`/solutions/${slug}`)
  })
}

export function revalidateVideos() {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.videos)
    revalidatePath('/watch')
  })
}

export function revalidatePodcasts() {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.podcasts)
    revalidatePath('/listen')
    revalidatePath('/')
  })
}

export function revalidateContributors() {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.contributors)
    revalidatePath('/contributors')
    revalidatePath('/community')
  })
}

export function revalidateProgrammes() {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.programmes)
    revalidatePath('/opportunities')
    revalidatePath('/programmes')
    revalidatePath('/about')
  })
}

export function revalidateCommunity() {
  safeRevalidate(() => {
    revalidateTag(CACHE_TAGS.community)
    revalidatePath('/community')
  })
}
