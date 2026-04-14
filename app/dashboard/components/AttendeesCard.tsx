import { Card, CardHeader } from '@/components/ui/Card'

interface Attendee {
  id: string
  full_name: string
  attendance: Array<{ payment_status: string }> | null
}

function avatarColor(name: string): string {
  const colors = [
    'bg-primary', 'bg-secondary', 'bg-amber-600', 'bg-purple-600',
    'bg-teal-600', 'bg-rose-600', 'bg-indigo-600',
  ]
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

const badgeMap: Record<string, { label: string; className: string }> = {
  confirmado:     { label: '✅ Confirmado',    className: 'badge-confirmed' },
  pago_enviado:   { label: '🟡 Pago enviado',  className: 'badge-pending' },
  sin_confirmar:  { label: '⬜ Sin confirmar', className: 'badge-unconfirmed' },
}

const statusOrder: Record<string, number> = { confirmado: 0, pago_enviado: 1, sin_confirmar: 2 }

export function AttendeesCard({ attendees }: { attendees: Attendee[] }) {
  const sorted = [...attendees].sort((a, b) => {
    const aStatus = a.attendance?.[0]?.payment_status ?? 'sin_confirmar'
    const bStatus = b.attendance?.[0]?.payment_status ?? 'sin_confirmar'
    return (statusOrder[aStatus] ?? 2) - (statusOrder[bStatus] ?? 2)
  })

  const confirmed = sorted.filter(a => a.attendance?.[0]?.payment_status === 'confirmado').length

  return (
    <Card>
      <CardHeader
        icon="👥"
        title="Asistentes"
        subtitle={`${confirmed} confirmado${confirmed !== 1 ? 's' : ''} · ${sorted.length} registrado${sorted.length !== 1 ? 's' : ''}`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sorted.map(person => {
          const status = person.attendance?.[0]?.payment_status ?? 'sin_confirmar'
          const badge = badgeMap[status] ?? badgeMap.sin_confirmar
          const initials = person.full_name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

          return (
            <div
              key={person.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-bg border border-border"
            >
              <div className={`w-9 h-9 rounded-full ${avatarColor(person.full_name)} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{person.full_name}</p>
                <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
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
