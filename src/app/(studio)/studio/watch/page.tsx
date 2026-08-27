import { StudioCollectionPage } from '@/components/studio/shared/studio-collection-page'
import { studioCollections } from '@/lib/studio/collection-configs'

export default function WatchStudioPage() {
  return <StudioCollectionPage config={studioCollections.videos} />
}
