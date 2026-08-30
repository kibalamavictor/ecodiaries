import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { guardPublicForm } from '@/lib/api-guard'
import { sendContributorApplicationNotification } from '@/lib/email'
import { contributorApplicationSchema } from '@/lib/contributors/schema'

function primaryPortfolioUrl(details: { type: string; [key: string]: unknown }[]): string {
  for (const detail of details) {
    if (detail.type === 'photographer' && typeof detail.portfolioUrl === 'string') return detail.portfolioUrl
    if (detail.type === 'filmmaker' && typeof detail.showreelUrl === 'string') return detail.showreelUrl
    if (detail.type === 'writer' && Array.isArray(detail.writingSamples) && detail.writingSamples[0]) {
      return String(detail.writingSamples[0])
    }
  }
  return ''
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const guard = await guardPublicForm(request, 'contributor-apply', body)
    if (guard) return guard

    const parsed = contributorApplicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid application' }, { status: 400 })
    }

    const application = parsed.data
    const { name, email, bio, region } = application.basicInfo

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'contributors',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 })
    }

    const role = application.contributionTypes
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(' · ')

    const expertise = application.details.flatMap((detail) => {
      if (detail.type === 'researcher') return [detail.fieldOfExpertise]
      if (detail.type === 'writer') return detail.preferredTopics
      return []
    })

    await payload.create({
      collection: 'contributors',
      data: {
        name,
        email,
        bio,
        region,
        applicationDetails: application,
        slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`,
        role,
        expertise: expertise.filter(Boolean).map((area) => ({ area })),
        portfolioUrl: primaryPortfolioUrl(application.details),
        applicationStatus: 'pending',
        password: crypto.randomUUID(),
      },
    })

    await sendContributorApplicationNotification({
      name,
      email,
      bio,
      region,
      application,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contributor application error:', error)
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
  }
}
