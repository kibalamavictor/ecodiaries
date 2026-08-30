import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export type SiteSettingsView = {
  missionCopy: string
  visionCopy: string
  impactStats: { num: string; label: string }[]
  socialLinks: { platform: string; url: string }[]
}

const defaults: SiteSettingsView = {
  missionCopy:
    'To make climate knowledge accessible by documenting and amplifying stories of environmental action, resilience, and innovation that inspire communities to act for a sustainable future.',
  visionCopy:
    'A world where every community has access to climate knowledge, learns from the experience of others, and is empowered to become part of the solution.',
  impactStats: [
    { num: '50+', label: 'Young climate storytellers trained' },
    { num: '100+', label: 'Climate stories and articles published' },
  ],
  socialLinks: [],
}

async function fetchSiteSettings(): Promise<SiteSettingsView> {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

    return {
      missionCopy: doc.missionCopy || defaults.missionCopy,
      visionCopy: doc.visionCopy || defaults.visionCopy,
      impactStats:
        doc.impactStats?.map((stat) => ({
          num: stat.value || '',
          label: stat.label || '',
        })) ?? defaults.impactStats,
      socialLinks:
        doc.socialLinks
          ?.filter((link) => link.platform && link.url)
          .map((link) => ({
            platform: link.platform!,
            url: link.url!,
          })) ?? [],
    }
  } catch {
    return defaults
  }
}

export function getSiteSettings() {
  return unstable_cache(fetchSiteSettings, ['site-settings'], {
    tags: ['site-settings'],
    revalidate: 60,
  })()
}
