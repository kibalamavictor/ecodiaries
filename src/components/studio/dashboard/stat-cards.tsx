'use client'

import {
  BookOpen,
  FilePen,
  FileText,
  Lightbulb,
  Mail,
  Users,
} from 'lucide-react'
import type { DashboardStat } from '@/lib/studio/types'
import { formatNumber } from '@/lib/studio/format'
import { cn } from '@/lib/utils'

const iconMap = {
  'published-stories': FileText,
  'draft-stories': FilePen,
  contributors: Users,
  solutions: Lightbulb,
  'unread-messages': Mail,
  programmes: BookOpen,
} as const

const toneStyles: Record<DashboardStat['tone'], { icon: string; bg: string }> = {
  green: { icon: 'text-green-600', bg: 'bg-green-100' },
  yellow: { icon: 'text-yellow-600', bg: 'bg-yellow-100' },
  blue: { icon: 'text-blue-600', bg: 'bg-blue-100' },
  red: { icon: 'text-red-600', bg: 'bg-red-100' },
  purple: { icon: 'text-purple-600', bg: 'bg-purple-100' },
  teal: { icon: 'text-teal-600', bg: 'bg-teal-100' },
}

export function DashboardStatCards({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const Icon = iconMap[stat.id as keyof typeof iconMap] ?? FileText
        const tone = toneStyles[stat.tone]
        return (
          <div key={stat.id} className="studio-card !p-4">
            <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', tone.bg)}>
              <Icon className={cn('h-5 w-5', tone.icon)} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-gray-800">{formatNumber(stat.value)}</p>
          </div>
        )
      })}
    </div>
  )
}
