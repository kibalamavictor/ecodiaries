import { getPayload } from 'payload'
import { paragraphsToLexical } from './launch-content'
import { seedMediaAlt } from '../collections/seed-fields'

export type PayloadClient = Awaited<ReturnType<typeof getPayload>>

const mediaCache = new Map<string, number>()

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatDurationLabel(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (secs === 0) return `${mins} min`
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function monthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

export async function safeRun(label: string, fn: () => Promise<void>) {
  try {
    await fn()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`✗ Failed ${label}: ${msg}`)
  }
}

export async function findBySlug(
  payload: PayloadClient,
  collection: 'categories' | 'contributors' | 'stories' | 'solutions' | 'videos' | 'podcast-episodes' | 'programmes' | 'organizations',
  slug: string,
) {
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function ensureMediaFromUrl(
  payload: PayloadClient,
  url: string,
  alt: string,
): Promise<number | null> {
  const cached = mediaCache.get(url)
  if (cached) return cached

  const resolvedAlt = alt.startsWith('[SEED-QA]') ? alt : seedMediaAlt(alt)

  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: resolvedAlt } },
    limit: 1,
  })
  if (existing.docs[0]) {
    const id = existing.docs[0].id as number
    mediaCache.set(url, id)
    return id
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('mpeg') ? 'mp3' : contentType.includes('png') ? 'png' : 'jpg'
    const created = await payload.create({
      collection: 'media',
      data: { alt: resolvedAlt },
      file: {
        data: buffer,
        mimetype: contentType,
        name: `${slugify(resolvedAlt).slice(0, 60)}.${ext}`,
        size: buffer.length,
      },
    })
    const id = created.id as number
    mediaCache.set(url, id)
    return id
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ! Media download failed for ${alt}: ${msg}`)
    return null
  }
}

export function bodyFromParagraphs(...paragraphs: string[]) {
  return paragraphsToLexical(...paragraphs)
}
