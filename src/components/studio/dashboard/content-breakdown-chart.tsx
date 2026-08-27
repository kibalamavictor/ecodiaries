'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { ContentBreakdownSegment } from '@/lib/studio/types'

export function ContentBreakdownChart({ segments }: { segments: ContentBreakdownSegment[] }) {
  const total = segments.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="studio-card">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-700">Content Breakdown</h2>
        <p className="text-sm text-gray-500">By collection</p>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
            >
              {segments.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf2', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className="text-gray-700">{segment.label}</span>
            </div>
            <span className="font-semibold text-gray-800">
              {segment.value}
              {total > 0 ? <span className="ml-1 text-xs font-normal text-gray-500">({Math.round((segment.value / total) * 100)}%)</span> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
