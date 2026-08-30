const PROGRAMME_IMAGES: Record<string, string> = {
  'storytelling-academy': 'https://picsum.photos/seed/storytelling-academy/960/540',
  'youth-reporters': 'https://picsum.photos/seed/youth-reporters/960/540',
  'climate-voices': 'https://picsum.photos/seed/climate-voices/960/540',
  'young-guardians': 'https://picsum.photos/seed/young-guardians/960/540',
  'research-hub': 'https://picsum.photos/seed/research-hub/960/540',
  'audio-stories': 'https://picsum.photos/seed/audio-stories/960/540',
}

export function getProgrammeImageUrl(slug: string, width = 960, height = 540): string {
  const base = PROGRAMME_IMAGES[slug] || `https://picsum.photos/seed/${slug}/${width}/${height}`
  if (width === 960 && height === 540) return base
  return `https://picsum.photos/seed/${slug}/${width}/${height}`
}
