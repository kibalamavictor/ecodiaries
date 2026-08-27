import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { editorOnly } from '@/lib/studio/editor-access'

export const Contributors: CollectionConfig = {
  slug: 'contributors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'applicationStatus', 'role', 'email'],
    group: 'Community',
    description: 'Approved contributors can log into /dashboard. Set applicationStatus to Approved and assign a password.',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    read: () => true,
    create: editorOnly,
    update: ({ req, id }) => {
      if (req.user?.collection === 'users') return true
      return req.user?.id === id
    },
    delete: editorOnly,
  },
  hooks: {
    afterLogin: [
      ({ user }) => {
        if (user.applicationStatus !== 'approved') {
          throw new APIError('Incorrect email or password.', 401)
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, admin: { position: 'sidebar' } },
    { name: 'role', type: 'text' },
    { name: 'region', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'profilePhoto', type: 'upload', relationTo: 'media' },
    { name: 'expertise', type: 'array', fields: [{ name: 'area', type: 'text' }] },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'applicationStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    { name: 'portfolioUrl', type: 'text' },
    {
      name: 'applicationDetails',
      type: 'json',
      admin: {
        description: 'Structured contributor application payload (from the public apply form).',
      },
    },
  ],
}
