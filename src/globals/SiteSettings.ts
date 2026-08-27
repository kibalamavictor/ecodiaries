import type { GlobalConfig } from 'payload'
import { editorOnly } from '@/lib/studio/editor-access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: editorOnly,
  },
  fields: [
    {
      name: 'impactStats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    { name: 'missionCopy', type: 'textarea' },
    { name: 'visionCopy', type: 'textarea' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
