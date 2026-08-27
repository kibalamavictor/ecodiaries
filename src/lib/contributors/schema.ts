import { z } from 'zod'

const contributorCategorySchema = z.enum([
  'writer',
  'photographer',
  'filmmaker',
  'researcher',
  'poet',
  'other',
])

export const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  region: z.string().min(2, 'Region is required'),
  bio: z.string().min(20, 'Bio should be at least 20 characters').max(200, 'Bio must be 200 characters or less'),
})

export const contributionTypesSchema = z
  .array(contributorCategorySchema)
  .min(1, 'Select at least one contribution type')

const writerDetailsSchema = z.object({
  type: z.literal('writer'),
  writingSamples: z
    .array(z.string().url('Enter a valid URL for each writing sample'))
    .min(1, 'Add at least one writing sample'),
  preferredTopics: z.array(z.string().min(1, 'Topic cannot be empty')).min(1, 'Add at least one topic'),
})

const photographerDetailsSchema = z.object({
  type: z.literal('photographer'),
  portfolioUrl: z.string().url('Enter a valid portfolio URL'),
  equipment: z.string().optional(),
})

const filmmakerDetailsSchema = z.object({
  type: z.literal('filmmaker'),
  showreelUrl: z.string().url('Enter a valid showreel URL'),
  pastWork: z.string().optional(),
})

const researcherDetailsSchema = z.object({
  type: z.literal('researcher'),
  fieldOfExpertise: z.string().min(2, 'Field of expertise is required'),
  institution: z.string().optional(),
  publications: z.array(z.string()).optional(),
})

const poetDetailsSchema = z.object({
  type: z.literal('poet'),
  poetrySamples: z.array(z.string().min(1, 'Sample cannot be empty')).min(1, 'Add at least one poetry sample'),
  themes: z.string().optional(),
})

const otherDetailsSchema = z.object({
  type: z.literal('other'),
  description: z.string().min(20, 'Describe how you would like to contribute (at least 20 characters)'),
})

export const contributionDetailSchema = z.discriminatedUnion('type', [
  writerDetailsSchema,
  photographerDetailsSchema,
  filmmakerDetailsSchema,
  researcherDetailsSchema,
  poetDetailsSchema,
  otherDetailsSchema,
])

export const photoSchema = z.object({
  croppedPreviewUrl: z.string().min(1, 'Add and crop a square profile photo'),
})

export const detailsStepSchema = z
  .object({
    contributionTypes: contributionTypesSchema,
    details: z.array(contributionDetailSchema).min(1),
    photo: photoSchema,
  })
  .superRefine((data, ctx) => {
    if (data.details.length !== data.contributionTypes.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Complete the fields for each selected contribution type',
        path: ['details'],
      })
    }
    for (const type of data.contributionTypes) {
      if (!data.details.some((d) => d.type === type)) {
        ctx.addIssue({
          code: 'custom',
          message: `Missing details for ${type}`,
          path: ['details'],
        })
      }
    }
  })

/** JSON body sent to the API (file stays client-side only). */
export const contributorApplicationSchema = z.object({
  basicInfo: basicInfoSchema,
  contributionTypes: contributionTypesSchema,
  details: z.array(contributionDetailSchema),
  photo: photoSchema,
  turnstileToken: z.string().optional(),
})

export type ContributorApplicationInput = z.infer<typeof contributorApplicationSchema>

export type ContributorCategoryValue = z.infer<typeof contributorCategorySchema>
