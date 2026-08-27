import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

async function assertStudioEditor() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') {
    throw new Error('You must sign in to Studio first.')
  }
  return user
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    return NextResponse.json(
      { error: 'Blob storage is not configured on this server.' },
      { status: 503 },
    )
  }

  try {
    await assertStudioEditor()

    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        maximumSizeInBytes: 512 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {
        // Media row is registered client-side via registerStudioMedia().
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    const status = /sign in/i.test(message) ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
