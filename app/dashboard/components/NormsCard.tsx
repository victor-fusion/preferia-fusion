import { Card } from '@/components/ui/Card'
import type { Norm } from '@/lib/types/database.types'

export function NormsCard({ norms }: { norms: Norm[] }) {
  return (
    <Card icon="📜" title="Normas del evento">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {norms.map(norm => (
          <div
            key={norm.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--feria-gold-pale)',
              border: '1px solid var(--feria-border)',
            }}
          >
            <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 1 }}>{norm.icon}</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--feria-dark)', lineHeight: 1.5 }}>{norm.text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
