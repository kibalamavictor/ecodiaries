import Link from 'next/link'
import { BrandMark } from '@/components/brand/BrandMark'
import { requireContributor } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { logoutContributor } from '@/app/(frontend)/dashboard/actions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const contributor = await requireContributor()
  const payload = await getPayloadClient()

  const stories = await payload.find({
    collection: 'stories',
    where: { author: { equals: contributor.id } },
    sort: '-updatedAt',
    limit: 20,
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-soft)', padding: '48px 28px' }}>
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Link href="/" className="brand">
            <BrandMark /> EcoDiaries
          </Link>
          <form action={logoutContributor}>
            <button type="submit" className="btn btn-outline btn-sm">
              Log out
            </button>
          </form>
        </div>

        <h1>Contributor Dashboard</h1>
        <p className="mt-8" style={{ color: 'var(--ink-soft)' }}>
          Welcome, {contributor.name}. Draft stories and submit them for editorial review.
        </p>

        <Link href="/dashboard/stories/new" className="btn btn-primary mt-24" style={{ width: 'fit-content' }}>
          New story draft
        </Link>

        <h2 className="mt-48">Your stories</h2>
        {stories.docs.length === 0 ? (
          <p className="mt-16" style={{ color: 'var(--ink-soft)' }}>No drafts yet.</p>
        ) : (
          <ul className="info-list mt-16">
            {stories.docs.map((story) => (
              <li key={story.id}>
                <div>
                  <div className="lbl">{story.status}</div>
                  <div className="val">
                    <Link href={`/dashboard/stories/${story.id}`}>{story.title}</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
