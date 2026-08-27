import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireContributor } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { saveStory } from '@/app/(frontend)/dashboard/actions'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export default async function EditStoryPage({ params }: Props) {
  const contributor = await requireContributor()
  const { id } = await params
  const payload = await getPayloadClient()

  const story = await payload.findByID({ collection: 'stories', id, depth: 0 })
  const authorId = typeof story.author === 'object' && story.author ? story.author.id : story.author
  if (authorId !== contributor.id) notFound()
  if (story.status === 'published') notFound()

  const bodyPlain =
    story.body && typeof story.body === 'object'
      ? JSON.stringify(story.body)
          .match(/"text":"([^"]*)"/g)
          ?.map((m) => m.replace(/"text":"|"/g, ''))
          .join('\n\n') || ''
      : ''

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-soft)', padding: '48px 28px' }}>
      <div className="wrap" style={{ maxWidth: 720 }}>
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          ← Back
        </Link>
        <p className="meta-strip mt-16">Status: {story.status}</p>
        <h1 className="mt-8">Edit draft</h1>
        <form action={saveStory} className="mt-32">
          <input type="hidden" name="id" value={String(story.id)} />
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" defaultValue={story.title} required />
          </div>
          <div className="form-field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" defaultValue={story.slug} />
          </div>
          <div className="form-field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea id="excerpt" name="excerpt" rows={3} defaultValue={story.excerpt || ''} />
          </div>
          <div className="form-field">
            <label htmlFor="body">Body</label>
            <textarea id="body" name="body" rows={12} defaultValue={bodyPlain} required />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" name="submit" value="false" className="btn btn-outline">
              Save draft
            </button>
            <button type="submit" name="submit" value="true" className="btn btn-primary">
              Submit for review
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
