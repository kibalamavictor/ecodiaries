import type { ZodIssue } from 'zod'
import type {
  ContributorApplication,
  ContributorCategory,
  ContributionDetails,
} from '@/lib/contributors/types'

export const EMPTY_CONTRIBUTOR_APPLICATION: ContributorApplication = {
  basicInfo: { name: '', email: '', region: '', bio: '' },
  contributionTypes: [],
  details: [],
  photo: { file: null, croppedPreviewUrl: null },
}

export function createEmptyDetail(type: ContributorCategory): ContributionDetails {
  switch (type) {
    case 'writer':
      return { type, writingSamples: [''], preferredTopics: [''] }
    case 'photographer':
      return { type, portfolioUrl: '' }
    case 'filmmaker':
      return { type, showreelUrl: '' }
    case 'researcher':
      return { type, fieldOfExpertise: '' }
    case 'poet':
      return { type, poetrySamples: [''] }
    default:
      return { type: 'other', description: '' }
  }
}

export function syncDetailsWithTypes(
  types: ContributorCategory[],
  existing: ContributionDetails[],
): ContributionDetails[] {
  return types.map((type) => {
    const found = existing.find((d) => d.type === type)
    return found ?? createEmptyDetail(type)
  })
}

export function buildContributorApplication(
  state: ContributorApplication,
): ContributorApplication {
  return {
    basicInfo: { ...state.basicInfo },
    contributionTypes: [...state.contributionTypes],
    details: state.details.map((d) => ({ ...d })) as ContributionDetails[],
    photo: {
      file: state.photo.file,
      croppedPreviewUrl: state.photo.croppedPreviewUrl,
    },
  }
}

export function toApiSubmissionBody(
  application: ContributorApplication,
  turnstileToken: string,
) {
  return {
    basicInfo: application.basicInfo,
    contributionTypes: application.contributionTypes,
    details: application.details,
    photo: { croppedPreviewUrl: application.photo.croppedPreviewUrl },
    turnstileToken,
  }
}

export function zodIssuesToFieldErrors(issues: ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of issues) {
    const key = issue.path.join('.') || '_form'
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

const CATEGORY_LABELS: Record<ContributorCategory, string> = {
  writer: 'Writer',
  photographer: 'Photographer',
  filmmaker: 'Filmmaker',
  researcher: 'Researcher',
  poet: 'Poet',
  other: 'Other',
}

export function categoryLabel(type: ContributorCategory): string {
  return CATEGORY_LABELS[type]
}

export function detailReviewRows(detail: ContributionDetails): { label: string; value: string }[] {
  switch (detail.type) {
    case 'writer':
      return [
        { label: 'Writing samples', value: detail.writingSamples.filter(Boolean).join(', ') },
        { label: 'Preferred topics', value: detail.preferredTopics.filter(Boolean).join(', ') },
      ]
    case 'photographer':
      return [
        { label: 'Portfolio', value: detail.portfolioUrl },
        ...(detail.equipment ? [{ label: 'Equipment', value: detail.equipment }] : []),
      ]
    case 'filmmaker':
      return [
        { label: 'Showreel', value: detail.showreelUrl },
        ...(detail.pastWork ? [{ label: 'Past work', value: detail.pastWork }] : []),
      ]
    case 'researcher':
      return [
        { label: 'Expertise', value: detail.fieldOfExpertise },
        ...(detail.institution ? [{ label: 'Institution', value: detail.institution }] : []),
        ...(detail.publications?.length
          ? [{ label: 'Publications', value: detail.publications.filter(Boolean).join(', ') }]
          : []),
      ]
    case 'poet':
      return [
        { label: 'Poetry samples', value: detail.poetrySamples.filter(Boolean).join(' · ') },
        ...(detail.themes ? [{ label: 'Themes', value: detail.themes }] : []),
      ]
    case 'other':
      return [{ label: 'Description', value: detail.description }]
  }
}
