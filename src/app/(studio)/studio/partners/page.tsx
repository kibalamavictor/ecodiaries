import { StudioCollectionPage } from '@/components/studio/shared/studio-collection-page'
import { studioCollections } from '@/lib/studio/collection-configs'

export default function PartnersStudioPage() {
  return <StudioCollectionPage config={studioCollections['partner-organisations']} />
}
