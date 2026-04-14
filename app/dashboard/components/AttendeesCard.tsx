import { Card } from '@/components/ui/Card'

interface Attendee {
  id: string
  full_name: string
  attendance: Array<{ payment_status: string }> | null
}

const AVATAR_COLORS = [
  '#9B2335', '#2A6B3C', '#C8963A', '#7B3F9E',
  '#1A6B8A', '#C0392B', '#1A5276',
]

function avatarColor(name: string): string {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const badgeMap: Record<string, { label: string; className: string }> = {
  confirmado:    { label: '✅ Confirmado',    className: 'badge-confirmed' },
  pago_enviado:  { label: '🟡 Pago enviado',  className: 'badge-pending' },
  sin_confirmar: { label: '⬜ Sin confirmar', className: 'badge-unconfirmed' },
}

const statusOrder: Record<string, number> = { confirmado: 0, pago_enviado: 1, sin_confirmar: 2 }

export function AttendeesCard({ attendees }: { attendees: Attendee[] }) {
  const sorted = [...attendees].sort((a, b) => {
    const as = a.attendance?.[0]?.payment_status ?? 'sin_confirmar'
    const bs = b.attendance?.[0]?.payment_status ?? 'sin_confirmar'
    return (statusOrder[as] ?? 2) - (statusOrder[bs] ?? 2)
  })

  const confirmed = sorted.filter(a => a.attendance?.[0]?.payment_status === 'confirmado').length

  return (
    <Card
      icon="👥"
      title="Asistentes"
      subtitle={`${confirmed} confirmado${confirmed !== 1 ? 's' : ''} · ${sorted.length} registrado${sorted.length !== 1 ? 's' : ''}`}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {sorted.map(person => {
          const status = person.attendance?.[0]?.payment_status ?? 'sin_confirmar'
          const badge = badgeMap[status] ?? badgeMap.sin_confirmar
          const initials = person.full_name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
          const color = avatarColor(person.full_name)

          return (
            <div
              key={person.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--feria-gold-pale)',
                border: '1px solid var(--feria-border)',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--feria-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {person.full_name}
                </p>
                <span className={badge.className} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  {badge.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
