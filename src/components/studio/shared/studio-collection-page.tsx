import { PayloadCollectionManager } from '@/components/studio/shared/payload-collection-manager'
import { StudioPage } from '@/components/studio/layout/studio-page'
import type { StudioCollectionConfig } from '@/lib/studio/collection-configs'
import { loadCollectionPage } from '@/lib/studio/load-collection-page'

export async function StudioCollectionPage({ config }: { config: StudioCollectionConfig }) {
  const { docs, relationshipOptions } = await loadCollectionPage(config)

  return (
    <StudioPage title={config.title} subtitle={config.description}>
      <PayloadCollectionManager config={config} initialDocs={docs} relationshipOptions={relationshipOptions} />
    </StudioPage>
  )
}
