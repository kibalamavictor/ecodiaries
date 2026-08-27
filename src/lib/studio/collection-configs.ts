import type { CollectionSlug } from 'payload'

export type FieldDef =
  | { name: string; label: string; type: 'text' | 'email' | 'textarea' | 'number' | 'date' | 'checkbox' }
  | { name: string; label: string; type: 'select'; options: { label: string; value: string }[] }
  | { name: string; label: string; type: 'relationship'; relationTo: CollectionSlug; hasMany?: boolean }
  | { name: string; label: string; type: 'upload'; accept?: string }

export type ColumnDef = {
  key: string
  label: string
  /** Dot path for nested values, e.g. "category.name" */
  path?: string
}

export type StudioCollectionConfig = {
  slug: CollectionSlug
  title: string
  description: string
  titleField: string
  columns: ColumnDef[]
  fields: FieldDef[]
  disableCreate?: boolean
  disableDelete?: boolean
  readOnlyFields?: string[]
  createOnlyFields?: string[]
}

function relName(value: unknown): string {
  if (!value) return '—'
  if (typeof value === 'object' && value !== null && 'name' in value) return String((value as { name: string }).name)
  if (typeof value === 'object' && value !== null && 'title' in value) return String((value as { title: string }).title)
  return String(value)
}

export function cellValue(doc: Record<string, unknown>, col: ColumnDef): string {
  const path = col.path || col.key
  const parts = path.split('.')
  let cur: unknown = doc
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return '—'
    cur = (cur as Record<string, unknown>)[p]
  }
  if (col.key === 'author' || col.key === 'category' || col.key === 'series') return relName(cur)
  if (typeof cur === 'boolean') return cur ? 'Yes' : 'No'
  if (cur == null || cur === '') return '—'
  return String(cur)
}

export const studioCollections: Record<string, StudioCollectionConfig> = {
  videos: {
    slug: 'videos',
    title: 'Watch',
    description: 'Video and documentary content managed in Studio.',
    titleField: 'title',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'categoryTag', label: 'Category' },
      { key: 'duration', label: 'Duration' },
      { key: 'publishedAt', label: 'Published' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'thumbnail', label: 'Thumbnail image', type: 'upload', accept: 'image/*' },
      { name: 'videoFile', label: 'Video file (MP4/WebM)', type: 'upload', accept: 'video/*' },
      { name: 'embedUrl', label: 'YouTube / Vimeo URL (watch, youtu.be, Shorts, or embed link)', type: 'text' },
      {
        name: 'categoryTag',
        label: 'Category',
        type: 'select',
        options: [
          { label: 'Documentary', value: 'Documentary' },
          { label: 'Field Report', value: 'Field Report' },
          { label: 'Interview', value: 'Interview' },
          { label: 'Community Spotlight', value: 'Community Spotlight' },
          { label: 'Educational', value: 'Educational' },
          { label: 'Short', value: 'Short' },
        ],
      },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'publishedAt', label: 'Published date', type: 'date' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
    ],
  },
  'podcast-episodes': {
    slug: 'podcast-episodes',
    title: 'Listen',
    description: 'Podcast episodes managed in Studio.',
    titleField: 'title',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'series', label: 'Series' },
      { key: 'duration', label: 'Duration' },
      { key: 'publishedAt', label: 'Published' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'thumbnail', label: 'Thumbnail image', type: 'upload', accept: 'image/*' },
      { name: 'coverArt', label: 'Cover art', type: 'upload', accept: 'image/*' },
      { name: 'audioFile', label: 'Audio file (MP3/M4A)', type: 'upload', accept: 'audio/*' },
      { name: 'embedUrl', label: 'Embed URL', type: 'text' },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'episodeNumber', label: 'Episode number', type: 'number' },
      { name: 'series', label: 'Series', type: 'relationship', relationTo: 'series' },
      { name: 'publishedAt', label: 'Published date', type: 'date' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
    ],
  },
  solutions: {
    slug: 'solutions',
    title: 'Solutions',
    description: 'Climate solutions directory for /solutions.',
    titleField: 'title',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category', path: 'category.name' },
      { key: 'statHighlight', label: 'Stat' },
      { key: 'verified', label: 'Verified' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'statHighlight', label: 'Stat highlight', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'heroImage', label: 'Cover image', type: 'upload', accept: 'image/*' },
      { name: 'category', label: 'Category', type: 'relationship', relationTo: 'categories' },
      { name: 'verified', label: 'Verified', type: 'checkbox' },
    ],
  },
  contributors: {
    slug: 'contributors',
    title: 'Contributors',
    description: 'Contributor profiles and application queue.',
    titleField: 'name',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'applicationStatus', label: 'Status' },
      { key: 'email', label: 'Email' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'profilePhoto', label: 'Profile photo', type: 'upload', accept: 'image/*' },
      { name: 'portfolioUrl', label: 'Portfolio URL', type: 'text' },
      { name: 'password', label: 'Password (new contributors only)', type: 'text' },
      {
        name: 'applicationStatus',
        label: 'Application status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
        ],
      },
    ],
    createOnlyFields: ['password'],
  },
  'partner-organisations': {
    slug: 'partner-organisations',
    title: 'Community Partners',
    description: 'Partner organisations shown on /community.',
    titleField: 'name',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'link', label: 'Website' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'logo', label: 'Logo', type: 'upload', accept: 'image/*' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'link', label: 'Website URL', type: 'text' },
    ],
  },
  programmes: {
    slug: 'programmes',
    title: 'Opportunities',
    description: 'Programmes, grants, fellowships, and events for /opportunities.',
    titleField: 'name',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'opportunityType', label: 'Type' },
      { key: 'status', label: 'Status' },
      { key: 'applicationUrl', label: 'External apply' },
      { key: 'cadence', label: 'Cadence' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'cadence', label: 'Cadence', type: 'text' },
      { name: 'accentColor', label: 'Accent CSS class', type: 'text' },
      {
        name: 'opportunityType',
        label: 'Opportunity type',
        type: 'select',
        options: [
          { label: 'Programme', value: 'programme' },
          { label: 'Grant', value: 'grant' },
          { label: 'Fellowship', value: 'fellowship' },
          { label: 'Event', value: 'event' },
        ],
      },
      { name: 'applicationOpenDate', label: 'Application open date', type: 'text' },
      { name: 'applicationCloseDate', label: 'Application close date', type: 'text' },
      { name: 'featured', label: 'Featured on programmes page', type: 'checkbox' },
      { name: 'applicationInstructions', label: 'Application instructions', type: 'textarea' },
      {
        name: 'applicationUrl',
        label: 'External application URL',
        type: 'text',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
        ],
      },
    ],
  },
  'contact-submissions': {
    slug: 'contact-submissions',
    title: 'Contact Submissions',
    description: 'Inbound messages from the public contact form.',
    titleField: 'name',
    disableCreate: true,
    disableDelete: false,
    readOnlyFields: ['name', 'email', 'reason', 'message'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'reason', label: 'Reason' },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'reason', label: 'Reason', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'New', value: 'new' },
          { label: 'Read', value: 'read' },
          { label: 'Responded', value: 'responded' },
        ],
      },
    ],
  },
}
