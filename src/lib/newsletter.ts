import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendNewsletterConfirmation, sendNewsletterEditorialNotice } from '@/lib/email'

/**
 * Double opt-in: ESP when configured, otherwise Postgres + Resend confirmation link.
 */
export async function subscribeToNewsletter(email: string) {
  const normalized = email.trim().toLowerCase()
  const provider = process.env.NEWSLETTER_PROVIDER

  if (provider === 'beehiiv' && process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalized, reactivate_existing: true, send_welcome_email: true }),
      },
    )
    if (!res.ok) throw new Error('ESP subscription failed')
    return { message: 'Check your email to confirm your subscription.' }
  }

  if (provider === 'mailchimp' && process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
    const dc = process.env.MAILCHIMP_API_KEY.split('-')[1]
    const res = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: normalized, status: 'pending' }),
      },
    )
    if (!res.ok && res.status !== 400) throw new Error('ESP subscription failed')
    return { message: 'Check your email to confirm your subscription.' }
  }

  const payload = await getPayload({ config })
  const token = crypto.randomBytes(32).toString('hex')
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${token}&email=${encodeURIComponent(normalized)}`

  const existing = await payload.find({
    collection: 'newsletter-subscribers',
    where: { email: { equals: normalized } },
    limit: 1,
  })

  if (existing.docs[0]?.status === 'confirmed') {
    return { message: 'You are already subscribed.' }
  }

  if (existing.docs.length) {
    await payload.update({
      collection: 'newsletter-subscribers',
      id: existing.docs[0].id,
      data: { status: 'pending', confirmToken: token },
    })
  } else {
    await payload.create({
      collection: 'newsletter-subscribers',
      data: { email: normalized, status: 'pending', confirmToken: token },
    })
  }

  await sendNewsletterConfirmation(normalized, confirmUrl)
  await sendNewsletterEditorialNotice(normalized)

  return { message: 'Check your email to confirm your subscription.' }
}
