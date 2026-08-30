/**
 * Smoke-test public forms against local API routes (dev: Turnstile skipped when secret unset).
 * Run: npm run qa:forms
 */
import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import config from '../payload.config'
import { contributorApplicationSchema } from '../lib/contributors/schema'
import { toApiSubmissionBody } from '../lib/contributors/application-helpers'
import type { ContributorApplication } from '../lib/contributors/types'

const BASE = process.env.QA_BASE_URL || 'http://localhost:3000'

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return { status: res.status, data }
}

async function smokeContact() {
  const payload = {
    name: 'QA Seed Tester',
    email: 'qa-contact-smoke@ecodiaries.test',
    reason: 'Something else',
    message:
      'This is a QA smoke-test contact submission verifying preview and success states render with realistic copy.',
    turnstileToken: 'qa-smoke-token',
  }
  const { status, data } = await postJson('/api/contact', payload)
  assert.equal(status, 200, `contact failed: ${JSON.stringify(data)}`)
  assert.equal(data.success, true)

  const cms = await getPayload({ config })
  const found = await cms.find({
    collection: 'contact-submissions',
    where: { email: { equals: payload.email } },
    limit: 1,
  })
  assert.ok(found.docs[0], 'contact submission not persisted')
  assert.equal(found.docs[0].name, payload.name)
  assert.equal(found.docs[0].reason, 'other')
  console.log('✓ Contact form smoke passed')
}

async function smokeNewsletter() {
  const email = `qa-newsletter-smoke-${Date.now()}@ecodiaries.test`
  const { status, data } = await postJson('/api/newsletter', {
    email,
    turnstileToken: 'qa-smoke-token',
  })
  assert.ok(status === 200 || status === 201, `newsletter failed: ${JSON.stringify(data)}`)

  const cms = await getPayload({ config })
  const found = await cms.find({
    collection: 'newsletter-subscribers',
    where: { email: { equals: email } },
    limit: 1,
  })
  assert.ok(found.docs[0], 'newsletter subscriber not persisted')
  console.log('✓ Newsletter form smoke passed')
}

async function smokeContributorApply() {
  const application: ContributorApplication = {
    basicInfo: {
      name: 'QA Smoke Applicant',
      email: `qa-apply-smoke-${Date.now()}@ecodiaries.test`,
      region: 'Lusaka, Zambia',
      bio: 'Investigative reporter covering mining pollution and community health in the Copperbelt.',
    },
    contributionTypes: ['writer', 'researcher'],
    details: [
      {
        type: 'writer',
        writingSamples: ['https://example.com/seed-qa-sample-story'],
        preferredTopics: ['Pollution', 'Water'],
      },
      {
        type: 'researcher',
        fieldOfExpertise: 'Environmental epidemiology',
        institution: 'University of Zambia',
        publications: ['https://example.com/seed-qa-paper'],
      },
    ],
    photo: { file: null, croppedPreviewUrl: 'data:image/jpeg;base64,/9j/4AAQ' },
  }

  const apiBody = toApiSubmissionBody(application, 'qa-smoke-token')
  const parsed = contributorApplicationSchema.safeParse(apiBody)
  assert.equal(parsed.success, true, JSON.stringify(parsed.success ? '' : parsed.error.issues))

  const { status, data } = await postJson('/api/contributors/apply', apiBody)
  assert.equal(status, 200, `contributor apply failed: ${JSON.stringify(data)}`)
  assert.equal(data.success, true)

  const cms = await getPayload({ config })
  const found = await cms.find({
    collection: 'contributors',
    where: { email: { equals: application.basicInfo.email } },
    limit: 1,
  })
  assert.ok(found.docs[0], 'contributor application not persisted')
  assert.equal(found.docs[0].applicationStatus, 'pending')
  assert.ok(found.docs[0].applicationDetails, 'applicationDetails missing')
  console.log('✓ Contributor application smoke passed')
}

async function smokeSupportLead() {
  const email = `qa-support-smoke-${Date.now()}@ecodiaries.test`
  const cms = await getPayload({ config })
  await cms.create({
    collection: 'interest-leads',
    data: {
      type: 'support',
      name: 'QA Support Tester',
      email,
      organizationName: 'Seed QA Foundation',
      message: 'Interest in supporting solar irrigation pilots in East Africa.',
      consent: true,
    },
  })
  const found = await cms.find({
    collection: 'interest-leads',
    where: { email: { equals: email } },
    limit: 1,
  })
  assert.ok(found.docs[0])
  assert.equal(found.docs[0].type, 'support')
  assert.equal(found.docs[0].name, 'QA Support Tester')
  console.log('✓ Support interest lead payload smoke passed')
}

async function main() {
  console.log(`QA form smoke against ${BASE}`)
  await smokeContact()
  await smokeNewsletter()
  await smokeContributorApply()
  await smokeSupportLead()
  console.log('\n✅ All form smoke tests passed')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
