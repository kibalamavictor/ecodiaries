import Link from 'next/link'
import { CategoryTag, StatusBadge } from '@/components/studio/shared/badges'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatRelativeTime } from '@/lib/studio/format'
import type { RecentContactRow, RecentStoryRow, TopContributorRow } from '@/lib/studio/types'
import { cn } from '@/lib/utils'

function ListCard({
  title,
  href,
  children,
}: {
  title: string
  href: string
  children: React.ReactNode
}) {
  return (
    <div className="studio-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-700">{title}</h2>
        <Link href={href} className="text-sm font-medium text-studio-accent hover:text-studio-primary">
          View all
        </Link>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function RecentStoriesCard({ stories }: { stories: RecentStoryRow[] }) {
  return (
    <ListCard title="Recent Stories" href="/studio/stories">
      {stories.length === 0 ? (
        <p className="text-sm text-gray-500">No stories yet.</p>
      ) : (
        stories.map((story) => (
          <div key={story.id} className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {story.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium text-gray-800">{story.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <CategoryTag category={story.category} />
                <StatusBadge status={story.status} />
                <span className="text-xs text-gray-500">{formatRelativeTime(story.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </ListCard>
  )
}

export function RecentContactsCard({ contacts }: { contacts: RecentContactRow[] }) {
  return (
    <ListCard title="Recent Contact Submissions" href="/studio/contact">
      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500">No messages yet.</p>
      ) : (
        contacts.map((contact) => (
          <Link
            key={contact.id}
            href="/studio/contact"
            className={cn(
              'flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50',
              contact.unread && 'font-medium',
            )}
          >
            <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', contact.unread ? 'bg-studio-accent' : 'bg-gray-300')} />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm text-gray-800">{contact.name}</p>
              <p className="line-clamp-1 text-xs text-gray-500">{contact.subject}</p>
            </div>
            <span className="shrink-0 text-xs text-gray-500">{formatRelativeTime(contact.timestamp)}</span>
          </Link>
        ))
      )}
    </ListCard>
  )
}

export function TopContributorsCard({ contributors }: { contributors: TopContributorRow[] }) {
  return (
    <ListCard title="Top Contributors" href="/studio/contributors">
      {contributors.length === 0 ? (
        <p className="text-sm text-gray-500">No approved contributors yet.</p>
      ) : (
        contributors.map((contributor) => (
          <div key={contributor.id} className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-green-100 text-studio-primary text-xs">
                {contributor.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800">{contributor.name}</p>
              <p className="text-xs text-gray-500">{contributor.role}</p>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {contributor.storiesCount} stories
            </span>
          </div>
        ))
      )}
    </ListCard>
  )
}
