/**
 * Curated Unsplash stills for editorial cards. Each id is a distinct photograph —
 * forests, farms, water, energy, and African landscapes — used when CMS media is missing.
 */

export const ENVIRONMENT_PHOTO_IDS = [
  '1441974231531-c6227db76b6e',
  '1470071459604-3b5ec3a7fe05',
  '1472214103451-9374bd1c798e',
  '1469474968028-56623f02e42e',
  '1433086966358-54859d0ed716',
  '1472396961693-142e6e269027',
  '1501854140801-50d01698950b',
  '1426604966848-d7adac402bff',
  '1475924156734-496f6cac6ec1',
  '1511497584788-876760111969',
  '1500382017468-9049fed747ef',
  '1464226184884-fa280b87c399',
  '1574943320219-553eb213f72d',
  '1416879595882-3373a0480b5b',
  '1497435334941-8c899ee9e8e9',
  '1508514177221-188b1cf16e9d',
  '1473341304170-971dccb5ac1e',
  '1548337138-e87d889cc369',
  '1542601906990-b4d3fb778b09',
  '1509099836639-18ba1795216d',
  '1547471080-7cc2caa01a7e',
  '1516026672322-bc52d61a55d5',
  '1516426122078-c23e76319801',
  '1547036967-23d11aacaee0',
  '1489392191049-fc10c97e64b6',
  '1447752875215-b2761acb3c5d',
  '1506260408121-e353d10b87c7',
  '1470770841072-f978cf4d019e',
  '1470252649378-9c29740c9fa8',
  '1518173946687-a4c8892bbd9f',
  '1425913397330-cf8af2ff40a1',
  '1470114716159-e389f8712fda',
  '1500534314209-a25ddb2bd429',
  '1509316785289-025f5b846b35',
  '1432405972618-c60b0225b8f9',
  '1507525428034-b723cf961d3e',
  '1625246333195-78d9c38ad449',
  '1558449028-b53a39d100fc',
  '1492496913980-501348b61469',
  '1500530855697-b586d89ba3ee',
  '1440342359743-84fcb8c21f21',
  '1464822759023-fed622ff2c3b',
  '1482192505345-5655af888cc4',
  '1506905925346-21bda4d32df4',
  '1493246507139-91e8fad9978e',
  '1523712999610-f77fbcfc3843',
  '1418065460487-3e41a6c84dc5',
  '1585504198199-20277593b94f',
  '1474044159687-1ee9f3a51722',
  '1559827260-dc66d52bef19',
  '1501785888041-af3ef285b470',
  '1532996122724-e3c354a0b15b',
  '1544551763-46a013bb70d5',
] as const

const UNIQUE_PHOTO_IDS = [...new Set(ENVIRONMENT_PHOTO_IDS)]

function hashKey(key: string): number {
  let hash = 2166136261
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function unsplashEnvironmentUrl(photoId: string, width = 1600): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`
}

/** Bright green-hills still for the homepage hero opening frame — local so it never reads as a black panel. */
export const HERO_NATURE_IMAGE = '/images/hero-nature.jpg'

export function environmentImageForKey(key: string, width = 1600): string {
  const index = hashKey(key) % UNIQUE_PHOTO_IDS.length
  return unsplashEnvironmentUrl(UNIQUE_PHOTO_IDS[index]!, width)
}

export function isGenericPlaceholder(url?: string | null): boolean {
  if (!url?.trim()) return true
  return url.includes('picsum.photos') || url.includes('eco-placeholder')
}

export function unsplashPhotoId(url: string): string | null {
  const match = url.match(/images\.unsplash\.com\/photo-([a-z0-9-]+)/i)
  return match?.[1] ?? null
}

export function uniqueEnvironmentImages(
  keys: string[],
  reservedPhotoIds: Iterable<string> = [],
  width = 1600,
): Record<string, string> {
  const used = new Set<number>()
  for (const id of reservedPhotoIds) {
    const index = UNIQUE_PHOTO_IDS.indexOf(id as (typeof UNIQUE_PHOTO_IDS)[number])
    if (index >= 0) used.add(index)
  }

  const assigned: Record<string, string> = {}

  for (const key of keys) {
    let index = hashKey(key) % UNIQUE_PHOTO_IDS.length
    let hops = 0
    while (used.has(index) && hops < UNIQUE_PHOTO_IDS.length) {
      index = (index + 1) % UNIQUE_PHOTO_IDS.length
      hops += 1
    }
    used.add(index)
    assigned[key] = unsplashEnvironmentUrl(UNIQUE_PHOTO_IDS[index]!, width)
  }

  return assigned
}

export function uniquifyEditorialImages<T>(
  items: T[],
  getKey: (item: T) => string,
  getUrl: (item: T) => string | undefined,
  setUrl: (item: T, url: string) => T,
): T[] {
  const reserved = new Set<string>()
  const needsAssign: string[] = []

  for (const item of items) {
    const url = getUrl(item)
    if (!url || isGenericPlaceholder(url)) {
      needsAssign.push(getKey(item))
      continue
    }

    const photoId = unsplashPhotoId(url)
    if (!photoId) continue
    if (reserved.has(photoId)) {
      needsAssign.push(getKey(item))
      continue
    }
    reserved.add(photoId)
  }

  const assigned = uniqueEnvironmentImages(needsAssign, reserved)

  return items.map((item) => {
    const replacement = assigned[getKey(item)]
    return replacement ? setUrl(item, replacement) : item
  })
}
