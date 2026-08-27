import Link from 'next/link'
import { requireContributor } from '@/lib/auth'
import { saveStory } from '@/app/(frontend)/dashboard/actions'

export const dynamic = 'force-dynamic'

export default async function NewStoryPage() {
  await requireContributor()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-soft)', padding: '48px 28px' }}>
      <div className="wrap" style={{ maxWidth: 720 }}>
        <Link href="/dashboard" className="btn btn-outline btn-sm">
          ← Back
        </Link>
        <h1 className="mt-24">New story draft</h1>
        <form action={saveStory} className="mt-32">
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" required />
          </div>
          <div className="form-field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" type="text" placeholder="auto-generated from title if empty" />
          </div>
          <div className="form-field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea id="excerpt" name="excerpt" rows={3} />
          </div>
          <div className="form-field">
            <label htmlFor="body">Body (plain text, paragraphs separated by blank lines)</label>
            <textarea id="body" name="body" rows={12} required />
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
