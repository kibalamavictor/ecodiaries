import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateCommunity, revalidatePodcasts, revalidateProgrammes, revalidateSolutions, revalidateVideos } from '@/lib/revalidate'
import { solutionPublishedRead } from '@/collections/Atlas'
import { editorOnly, publicReadEditorWrite } from '@/lib/studio/editor-access'
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'organization', 'solutionStatus', 'published'],
    group: 'Solutions Atlas',
  },
  access: {
    read: solutionPublishedRead,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'organization', type: 'relationship', relationTo: 'organizations' },
    { name: 'thesis', type: 'textarea', label: 'One-line thesis' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    { name: 'summary', type: 'textarea', label: 'Summary (plain text only on site)' },
    { name: 'body', type: 'richText', editor: lexicalEditor() },
    { name: 'location', type: 'text', label: 'Region' },
    { name: 'country', type: 'text' },
    {
      name: 'replicationScope',
      type: 'select',
      defaultValue: 'africa',
      label: 'Replication scope',
      admin: {
        description: 'Mark as Global when the solution is proven outside Africa and ready to replicate on the continent.',
      },
      options: [
        { label: 'Africa', value: 'africa' },
        { label: 'Global — ready to replicate in Africa', value: 'global' },
      ],
    },
    { name: 'locationName', type: 'text', label: 'Specific location name' },
    { name: 'statHighlight', type: 'text', label: 'Legacy key metric (fallback)' },
    {
      name: 'keyImpact',
      type: 'array',
      label: 'Impact tiles',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'unit', type: 'text' },
      ],
    },
    {
      name: 'sectors',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Agriculture', value: 'agriculture' },
        { label: 'Energy', value: 'energy' },
        { label: 'Water', value: 'water' },
        { label: 'Biodiversity', value: 'biodiversity' },
        { label: 'Pollution', value: 'pollution' },
        { label: 'Climate Justice', value: 'climate-justice' },
      ],
    },
    {
      name: 'solutionStatus',
      type: 'select',
      defaultValue: 'scaling',
      options: [
        { label: 'Piloted', value: 'piloted' },
        { label: 'Scaling', value: 'scaling' },
        { label: 'Established', value: 'established' },
      ],
    },
    {
      name: 'verificationTier',
      type: 'select',
      defaultValue: 'field_reported',
      options: [
        { label: 'Self reported', value: 'self_reported' },
        { label: 'Field reported', value: 'field_reported' },
        { label: 'Independently verified', value: 'independently_verified' },
      ],
    },
    {
      name: 'verifiedBy',
      type: 'select',
      options: [
        { label: 'Field reporter', value: 'field-reporter' },
        { label: 'Community validated', value: 'community-validated' },
        { label: 'Partner confirmed', value: 'partner-confirmed' },
      ],
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'partnerOrgs',
      type: 'array',
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      name: 'fundingStatus',
      type: 'select',
      defaultValue: 'seeking',
      options: [
        { label: 'Seeking funding', value: 'seeking' },
        { label: 'Partially funded', value: 'partial' },
        { label: 'Fully funded', value: 'funded' },
        { label: 'Not seeking', value: 'not_seeking' },
      ],
    },
    {
      name: 'fundingNeed',
      type: 'group',
      fields: [
        { name: 'amount', type: 'text' },
        { name: 'currency', type: 'text', defaultValue: 'USD' },
        { name: 'timeline', type: 'text' },
        { name: 'useOfFunds', type: 'textarea' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'relatedStories',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
    },
    {
      name: 'sdgTags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'SDG 1 — No Poverty', value: 'sdg-1' },
        { label: 'SDG 2 — Zero Hunger', value: 'sdg-2' },
        { label: 'SDG 6 — Clean Water', value: 'sdg-6' },
        { label: 'SDG 7 — Affordable Energy', value: 'sdg-7' },
        { label: 'SDG 13 — Climate Action', value: 'sdg-13' },
        { label: 'SDG 15 — Life on Land', value: 'sdg-15' },
      ],
    },
    { name: 'onePagerUrl', type: 'text' },
    { name: 'publishedAt', type: 'date' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'verified', type: 'checkbox', defaultValue: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'published', type: 'checkbox', defaultValue: true },
    { name: 'relatedStory', type: 'relationship', relationTo: 'stories' },
  ],
  hooks: {
    afterChange: [({ doc }) => revalidateSolutions(doc.slug as string)],
  },
}

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'opportunityType', 'status', 'featured', 'cadence'],
    group: 'Community',
  },
  access: publicReadEditorWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'cadence', type: 'text' },
    { name: 'accentColor', type: 'text' },
    { name: 'applicationOpenDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'applicationCloseDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'applicationInstructions', type: 'textarea' },
    {
      name: 'applicationUrl',
      type: 'text',
      admin: {
        description:
          'Optional. Paste the host organisation’s application form URL. Leave blank to use the EcoDiaries application form.',
      },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'opportunityType',
      type: 'select',
      defaultValue: 'programme',
      required: true,
      options: [
        { label: 'Programme', value: 'programme' },
        { label: 'Grant', value: 'grant' },
        { label: 'Fellowship', value: 'fellowship' },
        { label: 'Event', value: 'event' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
  hooks: { afterChange: [() => revalidateProgrammes()] },
}

export const Series: CollectionConfig = {
  slug: 'series',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { description: 'URL slug for /watch/series/[slug]' } },
    { name: 'description', type: 'textarea' },
    { name: 'coverArt', type: 'upload', relationTo: 'media' },
    { name: 'type', type: 'select', options: ['podcast', 'video'] },
  ],
  hooks: { afterChange: [() => revalidateVideos()] },
}

export const PodcastEpisodes: CollectionConfig = {
  slug: 'podcast-episodes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'series', 'duration', 'publishedAt'],
    group: 'Content',
  },
  access: publicReadEditorWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'series', type: 'relationship', relationTo: 'series' },
    { name: 'episodeNumber', type: 'number' },
    { name: 'seasonNumber', type: 'number' },
    { name: 'audioFile', type: 'upload', relationTo: 'media' },
    { name: 'embedUrl', type: 'text' },
    { name: 'duration', type: 'text', admin: { description: 'Display label e.g. 24 min' } },
    { name: 'durationSeconds', type: 'number', admin: { description: 'Length in seconds for the player' } },
    { name: 'description', type: 'textarea' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'coverArt', type: 'upload', relationTo: 'media' },
    { name: 'publishedAt', type: 'date' },
    { name: 'featured', type: 'checkbox' },
    {
      name: 'hosts',
      type: 'array',
      label: 'Hosts & Collaborators',
      fields: [
        { name: 'isExternal', type: 'checkbox', defaultValue: false, label: 'External guest' },
        { name: 'contributor', type: 'relationship', relationTo: 'contributors' },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'Host',
          options: [
            { label: 'Host', value: 'Host' },
            { label: 'Co-host', value: 'Co-host' },
            { label: 'Guest', value: 'Guest' },
            { label: 'Producer', value: 'Producer' },
            { label: 'Reporter', value: 'Reporter' },
          ],
        },
        { name: 'externalName', type: 'text' },
        { name: 'externalBio', type: 'textarea' },
        { name: 'externalAvatar', type: 'upload', relationTo: 'media' },
        { name: 'externalSocialUrl', type: 'text' },
      ],
    },
  ],
  hooks: { afterChange: [() => revalidatePodcasts()] },
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categoryTag', 'duration', 'publishedAt'],
    group: 'Content',
  },
  access: publicReadEditorWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'videoFile', type: 'upload', relationTo: 'media' },
    { name: 'embedUrl', type: 'text' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'categoryTag',
      type: 'select',
      options: ['Documentary', 'Field Report', 'Interview', 'Community Spotlight', 'Educational', 'Short'],
    },
    { name: 'duration', type: 'text', admin: { description: 'Display label e.g. 18:45' } },
    { name: 'durationSeconds', type: 'number', admin: { description: 'Length in seconds for the player' } },
    { name: 'description', type: 'textarea' },
    { name: 'series', type: 'relationship', relationTo: 'series' },
    { name: 'publishedAt', type: 'date' },
    { name: 'featured', type: 'checkbox' },
  ],
  hooks: { afterChange: [() => revalidateVideos()] },
}

export const PartnerOrganisations: CollectionConfig = {
  slug: 'partner-organisations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'link'],
    group: 'Community',
  },
  access: publicReadEditorWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'link', type: 'text' },
    { name: 'description', type: 'textarea' },
  ],
}

export const CommunityProjects: CollectionConfig = {
  slug: 'community-projects',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'relatedStory', type: 'relationship', relationTo: 'stories' },
  ],
  hooks: { afterChange: [() => revalidateCommunity()] },
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'reason', 'status', 'createdAt'],
    group: 'Inbox',
    description: 'Submissions from the public contact form. Mark as read or responded — do not create manually.',
  },
  access: {
    create: ({ req }) => !req.user,
    read: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Story tip', value: 'story-tip' },
        { label: 'Become a contributor', value: 'contributor' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Programmes', value: 'programmes' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Responded', value: 'responded' },
      ],
    },
  ],
}
