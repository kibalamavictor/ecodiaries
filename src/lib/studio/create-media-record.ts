import type { Payload } from 'payload'

type CreateMediaInput = {
  alt: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  prefix?: string
  clientUploadContext?: { prefix: string }
}

function needsFileBuffer(mimeType: string) {
  return mimeType.startsWith('image/')
}

async function loadFileBuffer(input: CreateMediaInput): Promise<Buffer> {
  if (!needsFileBuffer(input.mimeType)) {
    return Buffer.alloc(0)
  }

  const response = await fetch(input.url)
  if (!response.ok) {
    throw new Error('Uploaded file could not be read back from storage.')
  }
  return Buffer.from(await response.arrayBuffer())
}

export async function createMediaRecord(payload: Payload, input: CreateMediaInput) {
  const buffer = await loadFileBuffer(input)
  const prefix = input.prefix ?? input.clientUploadContext?.prefix ?? ''

  const media = await payload.create({
    collection: 'media',
    data: { alt: input.alt },
    file: {
      name: input.filename,
      mimetype: input.mimeType,
      size: input.filesize,
      data: buffer,
      clientUploadContext: { prefix },
    } as never,
    overrideAccess: true,
  })

  return media as typeof media & { url?: string | null; prefix?: string }
}
