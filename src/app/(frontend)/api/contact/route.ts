import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { guardPublicForm } from '@/lib/api-guard'
import { sendContactNotification, sendProgrammeApplicationNotification } from '@/lib/email'

const reasonMap: Record<string, string> = {
  'A story tip': 'story-tip',
  'Becoming a contributor': 'contributor',
  'A partnership': 'partnership',
  'Programmes & training': 'programmes',
  'Something else': 'other',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const guard = await guardPublicForm(request, 'contact', body)
    if (guard) return guard

    const { name, email, reason, message, programme } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        reason: reasonMap[reason] || reason || 'other',
        message,
        status: 'new',
      },
    })

    if (programme || reason === 'Programmes & training') {
      await sendProgrammeApplicationNotification({
        name,
        email,
        programme: programme || 'Programme',
        message: String(message),
      })
    } else {
      await sendContactNotification({ name, email, reason: reason || 'other', message })
    }

    return NextResponse.json({ success: true, emailAttempted: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
