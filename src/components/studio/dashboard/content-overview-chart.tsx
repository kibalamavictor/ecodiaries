'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartMonthPoint } from '@/lib/studio/types'

export function ContentOverviewChart({
  points,
  storiesThisMonth,
  solutionsThisMonth,
}: {
  points: ChartMonthPoint[]
  storiesThisMonth: number
  solutionsThisMonth: number
}) {
  return (
    <div className="studio-card">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-700">Content Published</h2>
        <p className="text-sm text-gray-500">Last 6 months</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id="storiesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4caf50" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4caf50" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="solutionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a3a2a" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1a3a2a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8edf2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf2', fontSize: 12 }} />
            <Area type="monotone" dataKey="stories" stroke="#4caf50" strokeWidth={2} fill="url(#storiesGrad)" name="Stories" />
            <Area type="monotone" dataKey="solutions" stroke="#1a3a2a" strokeWidth={2} fill="url(#solutionsGrad)" name="Solutions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Stories this month</p>
          <p className="text-2xl font-bold text-gray-800">{storiesThisMonth}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Solutions this month</p>
          <p className="text-2xl font-bold text-gray-800">{solutionsThisMonth}</p>
        </div>
      </div>
    </div>
  )
}
