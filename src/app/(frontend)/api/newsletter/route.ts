import { NextResponse } from 'next/server'
import { guardPublicForm } from '@/lib/api-guard'
import { subscribeToNewsletter } from '@/lib/newsletter'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const guard = await guardPublicForm(request, 'newsletter', body)
    if (guard) return guard

    const { email } = body
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
    }

    const result = await subscribeToNewsletter(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }
}
