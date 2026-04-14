'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { DrinkTotal } from '@/lib/types/database.types'

export function DrinkChart({ data }: { data: DrinkTotal[] }) {
  if (data.length === 0 || data.every(d => d.voter_count === 0)) {
    return (
      <div className="card-gold p-8 text-center text-text-muted">
        <p className="text-4xl mb-3">📊</p>
        <p>Todavía no hay preferencias guardadas.</p>
      </div>
    )
  }

  const chartData = data.map(d => ({
    name: `${d.emoji} ${d.name}`,
    value: Number(d.avg_percentage),
    voters: d.voter_count,
  }))

  const COLORS = ['#9B1C1C', '#1A6B3A', '#C9963C', '#7C3AED', '#0EA5E9', '#EA580C', '#0D9488', '#DB2777']

  return (
    <div className="card-gold p-5">
      <p className="text-xs text-text-muted mb-4">
        Basado en {data[0]?.voter_count ?? 0} respuestas · % medio por bebida
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Media']}
            contentStyle={{ borderRadius: '0.75rem', borderColor: '#E8D5B7' }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
