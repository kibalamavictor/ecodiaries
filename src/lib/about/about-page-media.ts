import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { getVideos } from '@/lib/cms/videos'

export type AboutVideoSlotId = 'hero' | 'who-we-are' | 'impact'

export type AboutVideoMedia =
  | {
      kind: 'ready'
      slot: AboutVideoSlotId
      src: string
      alt: string
      href: string
    }
  | {
      kind: 'missing'
      slot: AboutVideoSlotId
      flag: string
      detail: string
    }

export type AboutPageVideos = Record<AboutVideoSlotId, AboutVideoMedia>

const SLOT_FLAGS: Record<AboutVideoSlotId, { flag: string; detail: string }> = {
  hero: {
    flag: 'Hero video not available',
    detail:
      'No real EcoDiaries video is in the media library for “Turning Awareness into Action” yet — add one in Studio.',
  },
  'who-we-are': {
    flag: 'Who We Are video not available',
    detail:
      'No real EcoDiaries video is in the media library for this section yet — add one in Studio.',
  },
  impact: {
    flag: 'Our Impact video not available',
    detail:
      'No real EcoDiaries video is in the media library for Our Impact yet — add one in Studio.',
  },
}

function isPlaceholderImage(url: string): boolean {
  return url.includes('picsum.photos')
}

function missingSlot(slot: AboutVideoSlotId): AboutVideoMedia {
  const { flag, detail } = SLOT_FLAGS[slot]
  return { kind: 'missing', slot, flag, detail }
}

async function fetchAboutPageVideos(): Promise<AboutPageVideos> {
  const allVideos = await getVideos()
  const realVideos = allVideos.filter((video) => video.image && !isPlaceholderImage(video.image))

  const featured = realVideos.find((video) => video.featured)
  const rest = realVideos.filter((video) => video.slug !== featured?.slug)
  const ordered = featured ? [featured, ...rest] : realVideos

  const slots: AboutVideoSlotId[] = ['hero', 'who-we-are', 'impact']

  return slots.reduce((acc, slot, index) => {
    const video = ordered[index]
    if (!video) {
      acc[slot] = missingSlot(slot)
      return acc
    }

    acc[slot] = {
      kind: 'ready',
      slot,
      src: video.image,
      alt: video.title,
      href: `/watch#${video.slug}`,
    }
    return acc
  }, {} as AboutPageVideos)
}

export function getAboutPageVideos() {
  return unstable_cache(fetchAboutPageVideos, ['about-page-videos'], {
    tags: [CACHE_TAGS.videos],
    revalidate: 60,
  })()
}
