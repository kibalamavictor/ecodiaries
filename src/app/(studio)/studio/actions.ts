'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { normalizeEmbedUrl } from '@/lib/cms/video-playback'
import { assertMediaStorageConfigured } from '@/lib/media-storage'
import { assertEditor } from '@/lib/studio/assert-editor'
import { createMediaRecord } from '@/lib/studio/create-media-record'
import { purgePlaceholderContent } from '@/lib/studio/purge-content'
import type { CollectionSlug } from 'payload'

type JsonRecord = Record<string, unknown>

function prepareStudioDocument(slug: CollectionSlug, data: JsonRecord): JsonRecord {
  const next = { ...data }
  if (slug === 'videos' || slug === 'podcast-episodes') {
    if (typeof next.embedUrl === 'string') {
      const trimmed = next.embedUrl.trim()
      if (!trimmed) next.embedUrl = null
      else next.embedUrl = normalizeEmbedUrl(trimmed) ?? trimmed
    }
  }
  return next
}

export async function listCollection(slug: CollectionSlug, limit = 100) {
  await assertEditor()
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: slug, limit, depth: 1, sort: '-updatedAt' })
  return result.docs
}

export async function getDocument(slug: CollectionSlug, id: string | number) {
  await assertEditor()
  const payload = await getPayloadClient()
  return payload.findByID({ collection: slug, id, depth: 1 })
}

export async function createDocument(slug: CollectionSlug, data: JsonRecord) {
  await assertEditor()
  const payload = await getPayloadClient()
  const doc = await payload.create({
    collection: slug,
    data: prepareStudioDocument(slug, data) as never,
    overrideAccess: true,
  })
  revalidateStudioPaths(slug)
  return doc
}

export async function updateDocument(slug: CollectionSlug, id: string | number, data: JsonRecord) {
  await assertEditor()
  const payload = await getPayloadClient()
  const doc = await payload.update({
    collection: slug,
    id,
    data: prepareStudioDocument(slug, data) as never,
    overrideAccess: true,
  })
  revalidateStudioPaths(slug)
  return doc
}

export async function deleteDocument(slug: CollectionSlug, id: string | number) {
  await assertEditor()
  const payload = await getPayloadClient()
  await payload.delete({ collection: slug, id, overrideAccess: true })
  revalidateStudioPaths(slug)
}

export async function getSiteSettings() {
  await assertEditor()
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 0 })
}

export async function updateSiteSettings(data: JsonRecord) {
  await assertEditor()
  const payload = await getPayloadClient()
  const doc = await payload.updateGlobal({ slug: 'site-settings', data: data as never })
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/studio/settings')
  return doc
}

export async function updateStoryFromStudio(
  id: string | number,
  data: {
    title: string
    slug: string
    excerpt: string
    status: string
    categoryId?: number | null
    heroImageId?: number | null
  },
) {
  await assertEditor()
  const payload = await getPayloadClient()
  const doc = await payload.update({
    collection: 'stories',
    id,
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      status: data.status as 'draft' | 'in-review' | 'published',
      ...(data.categoryId ? { category: data.categoryId } : {}),
      ...(data.heroImageId != null ? { heroImage: data.heroImageId } : { heroImage: null }),
      ...(data.status === 'published' ? { publishedAt: new Date().toISOString() } : {}),
    },
    overrideAccess: true,
  })
  revalidatePath('/studio/stories')
  revalidatePath('/stories')
  revalidatePath('/')
  return doc
}

export async function deleteStoryFromStudio(id: string | number) {
  await assertEditor()
  const payload = await getPayloadClient()
  await payload.delete({ collection: 'stories', id, overrideAccess: true })
  revalidatePath('/studio/stories')
  revalidatePath('/stories')
  revalidatePath('/')
}

export type RegisterStudioMediaInput = {
  alt: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  prefix?: string
  clientUploadContext?: { prefix: string }
}

/** Register a media row after a direct Vercel Blob client upload. */
export async function registerStudioMedia(input: RegisterStudioMediaInput) {
  await assertEditor()
  try {
    const payload = await getPayloadClient()
    const media = await createMediaRecord(payload, input)
    return { id: media.id as number, url: media.url ?? input.url }
  } catch (err) {
    throw formatUploadError(err)
  }
}

/** Local / S3 server-side upload (small files, dev without Blob). */
export async function uploadStudioMedia(formData: FormData) {
  await assertEditor()
  assertMediaStorageConfigured()

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('No file selected')
  }

  const alt = String(formData.get('alt') || file.name || 'Upload')

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const payload = await getPayloadClient()
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: file.type || 'application/octet-stream',
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    })

    return { id: media.id as number, url: media.url ?? null }
  } catch (err) {
    throw formatUploadError(err)
  }
}

function formatUploadError(err: unknown): Error {
  const message = err instanceof Error ? err.message : 'Upload failed'
  if (/missing file|MissingFile/i.test(message)) {
    return new Error('Upload did not include a file. Please try again.')
  }
  if (/EROFS|read-only|ENOENT|EACCES/i.test(message)) {
    return new Error(
      'Could not save the file on this server. Ensure Vercel Blob or S3 storage is configured, then redeploy.',
    )
  }
  if (/413|too large|body exceeded|4\.5mb|payload too large/i.test(message)) {
    return new Error('File is too large. Try a smaller image (under 4 MB) or compress it first.')
  }
  return new Error(message || 'Upload failed')
}

export async function purgePlaceholderContentAction() {
  await assertEditor()
  return purgePlaceholderContent(false)
}

function revalidateStudioPaths(slug: CollectionSlug) {
  const map: Partial<Record<CollectionSlug, string[]>> = {
    stories: ['/studio/stories', '/stories', '/'],
    videos: ['/studio/watch', '/watch'],
    'podcast-episodes': ['/studio/listen', '/listen'],
    solutions: ['/studio/solutions', '/solutions'],
    contributors: ['/studio/contributors', '/contributors'],
    'partner-organisations': ['/studio/partners', '/community'],
    programmes: ['/studio/programmes', '/opportunities'],
    'contact-submissions': ['/studio/contact'],
  }
  if (slug === 'videos') revalidateTag(CACHE_TAGS.videos)
  if (slug === 'podcast-episodes') revalidateTag(CACHE_TAGS.podcasts)
  for (const path of map[slug] || [`/studio`]) {
    revalidatePath(path)
  }
}
