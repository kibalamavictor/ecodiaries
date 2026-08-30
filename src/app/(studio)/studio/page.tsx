import nextDynamic from 'next/dynamic'
import { StudioPage } from '@/components/studio/layout/studio-page'
import { DashboardActivityTable } from '@/components/studio/dashboard/dashboard-activity-table'
import {
  RecentContactsCard,
  RecentStoriesCard,
  TopContributorsCard,
} from '@/components/studio/dashboard/dashboard-lists'
import { DashboardStatCards } from '@/components/studio/dashboard/stat-cards'
import {
  getContentBreakdown,
  getContentPublishedChart,
  getDashboardActivityTable,
  getDashboardStats,
  getRecentContacts,
  getRecentStories,
  getTopContributors,
} from '@/lib/studio/dashboard-data'

const ContentOverviewChart = nextDynamic(
  () =>
    import('@/components/studio/dashboard/content-overview-chart').then(
      (module) => module.ContentOverviewChart,
    ),
  { loading: () => <div className="h-80 animate-pulse rounded-xl bg-studio-border" /> },
)

const ContentBreakdownChart = nextDynamic(
  () =>
    import('@/components/studio/dashboard/content-breakdown-chart').then(
      (module) => module.ContentBreakdownChart,
    ),
  { loading: () => <div className="h-80 animate-pulse rounded-xl bg-studio-border" /> },
)

export const dynamic = 'force-dynamic'

export default async function StudioDashboardPage() {
  const [stats, chart, breakdown, recentStories, recentContacts, topContributors, activityRows] =
    await Promise.all([
      getDashboardStats(),
      getContentPublishedChart(),
      getContentBreakdown(),
      getRecentStories(),
      getRecentContacts(),
      getTopContributors(),
      getDashboardActivityTable(),
    ])

  return (
    <StudioPage
      title="Dashboard"
      subtitle="Welcome back — here's what's happening on EcoDiaries."
    >
      <div className="space-y-6">
        <DashboardStatCards stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContentOverviewChart
              points={chart.points}
              storiesThisMonth={chart.storiesThisMonth}
              solutionsThisMonth={chart.solutionsThisMonth}
            />
          </div>
          <ContentBreakdownChart segments={breakdown} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RecentStoriesCard stories={recentStories} />
          <RecentContactsCard contacts={recentContacts} />
          <TopContributorsCard contributors={topContributors} />
        </div>

        <DashboardActivityTable rows={activityRows} />
      </div>
    </StudioPage>
  )
}
