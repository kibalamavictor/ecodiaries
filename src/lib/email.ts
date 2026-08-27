import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const editorialEmail = process.env.EDITORIAL_EMAIL || 'hello@ecodiaries.org'
const fromEmail = process.env.EMAIL_FROM || 'EcoDiaries <noreply@ecodiaries.org>'

async function sendEmail(payload: { to: string | string[]; subject: string; text: string; html?: string }) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — email not sent:', payload.subject)
    return false
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  })

  if (error) {
    console.error('[email] Resend error:', error)
    throw new Error(error.message || 'Failed to send email')
  }

  return true
}

export async function sendContactNotification(data: {
  name: string
  email: string
  reason: string
  message: string
}) {
  await sendEmail({
    to: editorialEmail,
    subject: `[EcoDiaries Contact] ${data.reason} from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nReason: ${data.reason}\n\n${data.message}`,
  })
}

export async function sendContributorApplicationNotification(data: {
  name: string
  email: string
  bio: string
  region?: string
  portfolio?: string
  application?: unknown
}) {
  const structured = data.application
    ? `\n\nStructured application:\n${JSON.stringify(data.application, null, 2)}`
  : ''
  await sendEmail({
    to: editorialEmail,
    subject: `[EcoDiaries] New contributor application: ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nRegion: ${data.region || 'N/A'}\nPortfolio: ${data.portfolio || 'N/A'}\n\nBio:\n${data.bio}${structured}`,
  })
}

export async function sendProgrammeApplicationNotification(data: {
  name: string
  email: string
  programme: string
  message: string
}) {
  await sendEmail({
    to: editorialEmail,
    subject: `[EcoDiaries] Programme application: ${data.programme} — ${data.name}`,
    text: `Programme: ${data.programme}\nName: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  })
}

export async function sendNewsletterConfirmation(email: string, confirmUrl: string) {
  await sendEmail({
    to: email,
    subject: 'Confirm your EcoDiaries newsletter subscription',
    text: `Confirm your subscription by visiting: ${confirmUrl}`,
    html: `<p>Thanks for subscribing to EcoDiaries.</p><p><a href="${confirmUrl}">Confirm your subscription</a></p>`,
  })
}

export async function sendNewsletterEditorialNotice(email: string) {
  await sendEmail({
    to: editorialEmail,
    subject: `[EcoDiaries] New newsletter signup: ${email}`,
    text: `New newsletter signup (pending confirmation): ${email}`,
  })
}
