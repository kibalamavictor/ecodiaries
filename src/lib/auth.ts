import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export async function getSessionContributor() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'contributors') return null
  if (user.applicationStatus !== 'approved') return null
  return user
}

export async function requireContributor() {
  const user = await getSessionContributor()
  if (!user) redirect('/dashboard/login')
  return user
}
