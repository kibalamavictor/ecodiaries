import assert from 'node:assert/strict'
import {
  buildContributorApplication,
  toApiSubmissionBody,
} from '../lib/contributors/application-helpers'
import { contributorApplicationSchema } from '../lib/contributors/schema'
import type { ContributorApplication } from '../lib/contributors/types'

const sample: ContributorApplication = {
  basicInfo: {
    name: 'Test Contributor',
    email: 'test@example.com',
    region: 'Kampala, Uganda',
    bio: 'Climate journalist covering agriculture and water stories across East Africa.',
  },
  contributionTypes: ['writer', 'photographer'],
  details: [
    {
      type: 'writer',
      writingSamples: ['https://example.com/story-one'],
      preferredTopics: ['Water', 'Agriculture'],
    },
    {
      type: 'photographer',
      portfolioUrl: 'https://example.com/portfolio',
      equipment: 'Mirrorless camera',
    },
  ],
  photo: {
    file: null,
    croppedPreviewUrl: 'data:image/jpeg;base64,/9j/4AAQ',
  },
}

const built = buildContributorApplication(sample)
assert.equal(built.basicInfo.name, sample.basicInfo.name)
assert.equal(built.contributionTypes.length, 2)
assert.equal(built.details.length, 2)
assert.ok(built.photo.croppedPreviewUrl)

const apiBody = toApiSubmissionBody(built, 'test-token')
const parsed = contributorApplicationSchema.safeParse(apiBody)
assert.equal(parsed.success, true, parsed.success ? '' : JSON.stringify(parsed.error.issues))

assert.equal('file' in (apiBody as { photo: object }).photo, false)

console.log('contributor application payload test passed')
