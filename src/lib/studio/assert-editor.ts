import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

/** For server actions — throws instead of redirecting (avoids opaque RSC errors). */
export async function assertEditor() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') {
    throw new Error('You must sign in to Studio first.')
  }
  return user
}
