import { getPayloadClient } from '@/lib/payload'
import { requireEditor } from '@/lib/studio/require-editor'
import type { StudioCollectionConfig } from '@/lib/studio/collection-configs'
import type { CollectionSlug } from 'payload'

export async function loadCollectionPage(config: StudioCollectionConfig) {
  await requireEditor()
  const payload = await getPayloadClient()

  const docs = await payload.find({
    collection: config.slug as CollectionSlug,
    limit: 200,
    depth: 1,
    sort: '-updatedAt',
  })

  const relationshipOptions: Record<string, { id: string | number; label: string }[]> = {}

  for (const field of config.fields) {
    if (field.type !== 'relationship') continue
    const rel = await payload.find({
      collection: field.relationTo,
      limit: 200,
      depth: 0,
      sort: field.relationTo === 'categories' || field.relationTo === 'series' ? 'name' : 'title',
    })
    relationshipOptions[field.name] = rel.docs.map((d) => ({
      id: d.id,
      label: String(
        ('name' in d && d.name) ||
          ('title' in d && d.title) ||
          d.id,
      ),
    }))
  }

  return {
    docs: docs.docs as unknown as Record<string, unknown>[],
    relationshipOptions,
  }
}
