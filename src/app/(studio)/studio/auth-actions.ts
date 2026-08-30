'use server'

import { headers, cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import {
  assertLoginRateLimit,
  GENERIC_LOGIN_ERROR,
  LOGIN_RATE_LIMIT_ERROR,
  parseLoginCredentials,
  toSafeLoginError,
} from '@/lib/auth/login-security'
import { LoginError } from '@/lib/studio/login-error'
import { getEditorSession } from '@/lib/studio/require-editor'
import type { StudioSearchResult } from '@/lib/studio/types'

export async function getEditorProfile() {
  const user = await getEditorSession()
  if (!user) return null
  const email = user.email as string
  const displayName =
    (typeof user.displayName === 'string' && user.displayName.trim()) ||
    email.split('@')[0]?.replace(/[._]/g, ' ') ||
    'Editor'
  const role = user.role === 'admin' ? 'Admin' : 'Editor'
  return {
    email,
    name: displayName,
    displayName: typeof user.displayName === 'string' ? user.displayName : '',
    role,
  }
}

export async function updateEditorDisplayName(displayName: string) {
  const user = await getEditorSession()
  if (!user?.id) throw new Error('Not authenticated')

  const trimmed = displayName.trim()
  if (!trimmed) throw new Error('Display name is required')
  if (trimmed.length > 80) throw new Error('Display name is too long')

  const payload = await getPayloadClient()
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { displayName: trimmed },
  })
}

export async function updateEditorPassword(currentPassword: string, newPassword: string) {
  const user = await getEditorSession()
  if (!user?.email) throw new Error('Not authenticated')

  const payload = await getPayloadClient()
  try {
    await payload.login({
      collection: 'users',
      data: { email: user.email, password: currentPassword },
    })
  } catch {
    throw new Error('Current password is incorrect')
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: { password: newPassword },
  })
}

export async function getUnreadContactCount(): Promise<number> {
  const payload = await getPayloadClient()
  const result = await payload.count({
    collection: 'contact-submissions',
    where: { status: { equals: 'new' } },
  })
  return result.totalDocs
}

export async function searchStudioContent(query: string): Promise<StudioSearchResult[]> {
  const user = await getEditorSession()
  if (!user) return []

  const q = query.trim()
  if (q.length < 2) return []

  const payload = await getPayloadClient()
  const [stories, contributors, contacts] = await Promise.all([
    payload.find({
      collection: 'stories',
      where: { title: { contains: q } },
      limit: 5,
      depth: 0,
    }),
    payload.find({
      collection: 'contributors',
      where: { name: { contains: q } },
      limit: 5,
      depth: 0,
    }),
    payload.find({
      collection: 'contact-submissions',
      where: { name: { contains: q } },
      limit: 5,
      depth: 0,
    }),
  ])

  return [
    ...stories.docs.map((s) => ({
      id: `story-${s.id}`,
      type: 'story' as const,
      title: s.title,
      subtitle: 'Story',
      href: '/studio/stories',
    })),
    ...contributors.docs.map((c) => ({
      id: `contributor-${c.id}`,
      type: 'contributor' as const,
      title: c.name,
      subtitle: c.role || 'Contributor',
      href: '/studio/contributors',
    })),
    ...contacts.docs.map((c) => ({
      id: `contact-${c.id}`,
      type: 'contact' as const,
      title: c.name,
      subtitle: c.reason?.replace(/-/g, ' ') ?? 'Contact',
      href: '/studio/contact',
    })),
  ]
}

export type StudioNotificationItem = {
  id: string
  title: string
  meta: string
  href: string
  timestamp: string
}

export async function getStudioNotifications(): Promise<{
  items: StudioNotificationItem[]
  unreadCount: number
}> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'users') {
    return { items: [], unreadCount: 0 }
  }

  const [contacts, reviewStories] = await Promise.all([
    payload.find({
      collection: 'contact-submissions',
      where: { status: { equals: 'new' } },
      sort: '-createdAt',
      limit: 5,
      depth: 0,
    }),
    payload.find({
      collection: 'stories',
      where: { status: { equals: 'in-review' } },
      sort: '-updatedAt',
      limit: 3,
      depth: 0,
    }),
  ])

  const items: StudioNotificationItem[] = [
    ...contacts.docs.map((c) => ({
      id: `contact-${c.id}`,
      title: `Contact: ${c.name}`,
      meta: c.reason?.replace(/-/g, ' ') ?? 'New message',
      href: '/studio/contact',
      timestamp: c.createdAt,
    })),
    ...reviewStories.docs.map((s) => ({
      id: `story-${s.id}`,
      title: s.title,
      meta: 'Awaiting review',
      href: '/studio/stories',
      timestamp: s.updatedAt,
    })),
  ]
    .filter((item) => item.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return { items, unreadCount: contacts.totalDocs }
}

export async function loginEditor(email: string, password: string) {
  try {
    await assertLoginRateLimit('studio')
  } catch (err) {
    throw new LoginError(err instanceof Error ? err.message : LOGIN_RATE_LIMIT_ERROR)
  }

  let credentials: { email: string; password: string }
  try {
    credentials = parseLoginCredentials(email, password)
  } catch {
    throw new LoginError(GENERIC_LOGIN_ERROR)
  }

  let payload
  try {
    payload = await getPayloadClient()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (process.env.NODE_ENV !== 'production' && msg.includes('ECONNREFUSED')) {
      throw new LoginError(
        'Database is not reachable. Start Postgres (npm run db:up), then run npm run seed.',
      )
    }
    throw new LoginError(toSafeLoginError(err).message)
  }

  let result
  try {
    result = await payload.login({
      collection: 'users',
      data: credentials,
    })
    if (!result.token) throw new LoginError(GENERIC_LOGIN_ERROR)
  } catch (err) {
    if (err instanceof LoginError) throw err
    throw new LoginError(toSafeLoginError(err).message)
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function logoutEditor() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
}
