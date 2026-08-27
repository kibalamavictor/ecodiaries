import { condenseToSentences } from '@/lib/about/condense-copy'

/**
 * Copy mirrored from the desktop About page (`about/page.tsx`).
 * CMS today only provides missionCopy, visionCopy, and impactStats (site-settings).
 *
 * Not in CMS yet (flag for editors / future fields):
 * - aboutHeroHeadline
 * - aboutIntroParagraphs
 * - about page video slots (mobile resolves from CMS videos; see about-page-media.ts)
 * - missionMobileSummary / visionMobileSummary (mobile uses firstSentence on full CMS text)
 */

export const ABOUT_HERO_HEADLINE =
  'A climate storytelling platform documenting stories that matter'

/** Shorter intro below the hero video on mobile — matches the About mobile design. */
export const ABOUT_MOBILE_INTRO =
  'Climate solutions across Africa often stay invisible beyond the communities where they happen. We document them so others can learn and act.'

/** Default caption when no hero video metadata is available. */
export const ABOUT_HERO_VIDEO_CAPTION = 'Daniel Okello, field reporter — Northern Uganda'

/** Shorter stat labels for the mobile About stats strip. */
export const ABOUT_MOBILE_STAT_LABELS: Record<string, string> = {
  'Young climate storytellers trained': 'Storytellers trained',
  'Climate stories and articles published': 'Stories published',
}

export const ABOUT_ACTION_EYEBROW = 'Turning Awareness into Action'

export const WHO_WE_ARE_EYEBROW = 'Who We Are'

export const WHO_WE_ARE_HEADLINE = 'A platform built for climate stories'

export const OUR_IMPACT_EYEBROW = 'Our Impact'

/** Intro paragraphs — matches desktop right-column copy. */
export const ABOUT_INTRO_PARAGRAPHS = [
  'Across Africa, communities are already responding to climate challenges with creativity, innovation, and resilience. Many of these solutions remain invisible beyond the communities where they originate.',
  'EcoDiaries exists to identify, document, and amplify these stories so others can learn, adapt, and act — connecting communities and promoting the spread of proven environmental solutions.',
] as const

/** Both intro sentences — complete thoughts only, no mid-phrase cuts. */
export function aboutIntroForMobile(): string {
  return condenseToSentences(ABOUT_INTRO_PARAGRAPHS.join(' '), 2)
}
