'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  assertLoginRateLimit,
  GENERIC_LOGIN_ERROR,
  LOGIN_RATE_LIMIT_ERROR,
  parseLoginCredentials,
  toSafeLoginError,
} from '@/lib/auth/login-security'
import { getPayloadClient } from '@/lib/payload'
import { revalidateStories } from '@/lib/revalidate'

export async function loginContributor(formData: FormData) {
  try {
    await assertLoginRateLimit('dashboard')
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : LOGIN_RATE_LIMIT_ERROR)
  }

  let credentials: { email: string; password: string }
  try {
    credentials = parseLoginCredentials(
      String(formData.get('email') || ''),
      String(formData.get('password') || ''),
    )
  } catch {
    throw new Error(GENERIC_LOGIN_ERROR)
  }

  const payload = await getPayloadClient()
  try {
    const result = await payload.login({
      collection: 'contributors',
      data: credentials,
    })

    if (!result.token) throw new Error(GENERIC_LOGIN_ERROR)

    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  } catch {
    throw new Error(toSafeLoginError(null).message)
  }

  redirect('/dashboard')
}

export async function logoutContributor() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/dashboard/login')
}

export async function saveStory(formData: FormData) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'contributors') throw new Error('Unauthorized')

  const id = formData.get('id') ? String(formData.get('id')) : undefined
  const title = String(formData.get('title') || '')
  const slug = String(formData.get('slug') || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
  const excerpt = String(formData.get('excerpt') || '')
  const bodyText = String(formData.get('body') || '')
  const submit = formData.get('submit') === 'true'

  const body = {
    root: {
      type: 'root',
      children: bodyText.split('\n\n').map((para) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: para, version: 1 }],
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }

  const data = {
    title,
    slug,
    excerpt,
    body,
    author: user.id,
    status: submit ? ('in-review' as const) : ('draft' as const),
  }

  if (id) {
    await payload.update({ collection: 'stories', id, data, overrideAccess: false, user })
  } else {
    await payload.create({ collection: 'stories', data, overrideAccess: false, user })
  }

  revalidateStories(slug)
  redirect('/dashboard')
}
