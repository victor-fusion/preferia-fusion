import { Card, CardHeader } from '@/components/ui/Card'
import type { Norm } from '@/lib/types/database.types'

export function NormsCard({ norms }: { norms: Norm[] }) {
  return (
    <Card>
      <CardHeader icon="📜" title="Normas del evento" />
      <div className="flex flex-col gap-3">
        {norms.map(norm => (
          <div
            key={norm.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-bg border border-border"
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{norm.icon}</span>
            <p className="text-sm text-text">{norm.text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
