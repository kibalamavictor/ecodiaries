import { StudioCollectionPage } from '@/components/studio/shared/studio-collection-page'
import { studioCollections } from '@/lib/studio/collection-configs'

export default function ProgrammesStudioPage() {
  return <StudioCollectionPage config={studioCollections.programmes} />
}
