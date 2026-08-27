import Link from 'next/link'
import { StoriesManager } from '@/components/studio/stories/stories-manager'
import { StudioPage } from '@/components/studio/layout/studio-page'
import { Button } from '@/components/ui/button'
import { fetchAdminStories, fetchStoryCategories } from '@/lib/studio/stories'
import { requireEditor } from '@/lib/studio/require-editor'

export default async function StudioStoriesPage() {
  await requireEditor()
  const [stories, categories] = await Promise.all([fetchAdminStories(), fetchStoryCategories()])

  return (
    <StudioPage
      title="Stories"
      subtitle="Manage published articles, drafts, and submissions in review."
      action={
        <Button asChild className="studio-btn">
          <Link href="/studio/stories">+ New Story</Link>
        </Button>
      }
    >
      <StoriesManager initialStories={stories} categories={categories} />
    </StudioPage>
  )
}
