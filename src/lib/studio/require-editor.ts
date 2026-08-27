import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export async function requireEditor() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') {
    redirect('/studio/login')
  }
  return user
}

export async function getEditorSession() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') return null
  return user
}
