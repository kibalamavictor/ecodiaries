import type { Field } from 'payload'

/** Marks CMS records created for QA — safe to bulk-delete in cleanup passes. */
export const isSeedContentField: Field = {
  name: 'isSeedContent',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Set by seed scripts for QA placeholder content. You can toggle per item.',
  },
}

export const SEED_MEDIA_ALT_PREFIX = '[SEED-QA]'

export function seedMediaAlt(label: string): string {
  return `${SEED_MEDIA_ALT_PREFIX} ${label}`
}
