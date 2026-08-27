import { StudioCollectionPage } from '@/components/studio/shared/studio-collection-page'
import { studioCollections } from '@/lib/studio/collection-configs'

export default function ContactStudioPage() {
  return <StudioCollectionPage config={studioCollections['contact-submissions']} />
}
