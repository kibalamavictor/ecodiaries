import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email || !token) {
    return NextResponse.redirect(new URL('/contact?newsletter=invalid', request.url))
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'newsletter-subscribers',
    where: {
      and: [{ email: { equals: email } }, { confirmToken: { equals: token } }],
    },
    limit: 1,
  })

  const subscriber = result.docs[0]
  if (!subscriber) {
    return NextResponse.redirect(new URL('/contact?newsletter=invalid', request.url))
  }

  await payload.update({
    collection: 'newsletter-subscribers',
    id: subscriber.id,
    data: { status: 'confirmed', confirmedAt: new Date().toISOString(), confirmToken: '' },
  })

  return NextResponse.redirect(new URL('/contact?newsletter=confirmed', request.url))
}
