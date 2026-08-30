'use client'

import { registerStudioMedia, uploadStudioMedia } from '@/app/(studio)/studio/actions'
import { compressImageForUpload } from '@/lib/compress-image'
import { upload } from '@vercel/blob/client'

const USE_BLOB = process.env.NEXT_PUBLIC_STUDIO_BLOB_UPLOAD === 'true'
const PAYLOAD_BLOB_ROUTE = '/api/studio/blob-upload'

export type StudioUploadResult = { id: number; url: string | null }

function sanitizeUploadFilename(filename: string): string {
  let sanitized = filename.replace(/\\/g, '/')
  const lastSlash = sanitized.lastIndexOf('/')
  if (lastSlash !== -1) sanitized = sanitized.slice(lastSlash + 1)
  if (sanitized === '.' || sanitized === '..') sanitized = ''
  sanitized = sanitized.replace(/[\x00-\x1f\x80-\x9f]/g, '')
  return sanitized || 'upload'
}

function decodeFilename(pathname: string, fallback: string) {
  const segment = pathname.split('/').pop() || fallback
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function wrapBlobUploadError(err: unknown): Error {
  const message = err instanceof Error ? err.message : 'Upload failed'
  if (/client token|presigned url/i.test(message)) {
    return new Error(
      'Upload could not start. Sign out of Studio, sign back in, then try again. If it persists, blob storage may not be configured on the server.',
    )
  }
  return err instanceof Error ? err : new Error(message)
}

export async function uploadStudioFile(file: File, alt: string): Promise<StudioUploadResult> {
  const isImage = file.type.startsWith('image/')
  const prepared = isImage ? await compressImageForUpload(file) : file
  const label = alt || file.name
  const mimeType = prepared.type || 'application/octet-stream'

  if (USE_BLOB) {
    const pathname = sanitizeUploadFilename(prepared.name)
    const prefix = ''

    try {
      const blob = await upload(pathname, prepared, {
        access: 'public',
        handleUploadUrl: PAYLOAD_BLOB_ROUTE,
        contentType: mimeType,
      })

      const filename = decodeFilename(blob.pathname, prepared.name)

      return registerStudioMedia({
        alt: label,
        url: blob.url,
        filename,
        mimeType,
        filesize: prepared.size,
        prefix,
        clientUploadContext: { prefix },
      })
    } catch (err) {
      throw wrapBlobUploadError(err)
    }
  }

  const formData = new FormData()
  formData.append('file', prepared)
  formData.append('alt', label)
  return uploadStudioMedia(formData)
}
