import { StudioCollectionPage } from '@/components/studio/shared/studio-collection-page'
import { studioCollections } from '@/lib/studio/collection-configs'

export default function ContributorsStudioPage() {
  return <StudioCollectionPage config={studioCollections.contributors} />
}
