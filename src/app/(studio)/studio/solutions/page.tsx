import { StudioCollectionPage } from '@/components/studio/shared/studio-collection-page'
import { studioCollections } from '@/lib/studio/collection-configs'

export default function SolutionsStudioPage() {
  return <StudioCollectionPage config={studioCollections.solutions} />
}
