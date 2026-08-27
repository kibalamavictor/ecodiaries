import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateSolutions } from '@/lib/revalidate'
import { editorOnly } from '@/lib/studio/editor-access'
const orgTypeOptions = [
  { label: 'NGO', value: 'ngo' },
  { label: 'Cooperative', value: 'cooperative' },
  { label: 'Social Enterprise', value: 'social-enterprise' },
  { label: 'Research Institute', value: 'research' },
  { label: 'Community Group', value: 'community' },
  { label: 'Government Programme', value: 'government' },
]

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  labels: { singular: 'Organization', plural: 'Organizations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'verified', 'hqLocation'],
    group: 'Solutions Atlas',
  },
  access: {
    read: () => true,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'type',
      type: 'select',
      options: orgTypeOptions,
      defaultValue: 'ngo',
    },
    { name: 'tagline', type: 'text' },
    { name: 'bio', type: 'richText', editor: lexicalEditor() },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'website', type: 'text' },
    { name: 'donationUrl', type: 'text', label: 'External donation / support URL' },
    { name: 'foundedYear', type: 'number' },
    { name: 'hqLocation', type: 'text', label: 'HQ location' },
    {
      name: 'regions',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'East Africa', value: 'east-africa' },
        { label: 'West Africa', value: 'west-africa' },
        { label: 'Southern Africa', value: 'southern-africa' },
        { label: 'Sahel', value: 'sahel' },
        { label: 'Horn of Africa', value: 'horn-of-africa' },
        { label: 'Central Africa', value: 'central-africa' },
        { label: 'Pan-African', value: 'pan-african' },
      ],
    },
    {
      name: 'focusAreas',
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
      name: 'team',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'instagram', type: 'text' },
      ],
    },
    { name: 'verified', type: 'checkbox', defaultValue: false },
  ],
}

export const ImpactUpdates: CollectionConfig = {
  slug: 'impact-updates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'date'],
    group: 'Solutions Atlas',
  },
  access: {
    read: () => true,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'solutions', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText', editor: lexicalEditor() },
    {
      name: 'metrics',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'media',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
  ],
}

export const InterestLeads: CollectionConfig = {
  slug: 'interest-leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'project', 'createdAt'],
    group: 'Solutions Atlas',
  },
  access: {
    read: editorOnly,
    create: () => true,
    update: editorOnly,
    delete: editorOnly,
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'solutions' },
    { name: 'organization', type: 'relationship', relationTo: 'organizations' },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Support', value: 'support' },
        { label: 'Partner', value: 'partner' },
        { label: 'Request intro', value: 'intro' },
        { label: 'Download one-pager', value: 'download' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'organizationName', type: 'text', label: 'Organization' },
    { name: 'message', type: 'textarea' },
    { name: 'consent', type: 'checkbox', required: true },
  ],
}

export function solutionPublishedRead({ req }: { req: { user?: { collection?: string } | null } }) {
  if (req.user?.collection === 'users') return true
  return { published: { equals: true } }
}
