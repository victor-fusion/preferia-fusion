'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

type Filter = 'todos' | 'pago_enviado' | 'confirmado' | 'sin_confirmar'

interface Row {
  id: string
  full_name: string
  created_at: string
  payment_status: string
  payment_confirmed_at: string | null
  attendance_created_at: string | null
}

const badgeMap: Record<string, { label: string; className: string }> = {
  confirmado:    { label: '✅ Confirmado',    className: 'badge-confirmed' },
  pago_enviado:  { label: '🟡 Pago enviado',  className: 'badge-pending' },
  sin_confirmar: { label: '⬜ Sin confirmar', className: 'badge-unconfirmed' },
}

export function PaymentTable({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState(initialRows)
  const [filter, setFilter] = useState<Filter>('todos')
  const [loading, setLoading] = useState<string | null>(null)

  const filters: { key: Filter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'pago_enviado', label: '🟡 Pendientes' },
    { key: 'confirmado', label: '✅ Confirmados' },
    { key: 'sin_confirmar', label: '⬜ Sin confirmar' },
  ]

  const visible = filter === 'todos' ? rows : rows.filter(r => r.payment_status === filter)

  async function handleConfirm(userId: string) {
    setLoading(userId)
    const supabase = createClient()
    await supabase
      .from('attendance')
      .update({
        payment_status: 'confirmado',
        payment_confirmed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
    setRows(prev =>
      prev.map(r => r.id === userId
        ? { ...r, payment_status: 'confirmado', payment_confirmed_at: new Date().toISOString() }
        : r
      )
    )
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
              filter === f.key
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-muted border-border hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2">
        {visible.map(row => {
          const badge = badgeMap[row.payment_status] ?? badgeMap.sin_confirmar
          const isPending = row.payment_status === 'pago_enviado'
          return (
            <div
              key={row.id}
              className={[
                'card-gold p-4 flex flex-col sm:flex-row sm:items-center gap-3',
                isPending ? 'border-amber-400 bg-amber-50/50' : '',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text">{row.full_name}</p>
                <p className="text-xs text-text-muted">
                  Registrado {new Date(row.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${badge.className}`}>
                {badge.label}
              </span>
              {isPending && (
                <Button
                  size="sm"
                  loading={loading === row.id}
                  onClick={() => handleConfirm(row.id)}
                >
                  Verificar pago
                </Button>
              )}
            </div>
          )
        })}
        {visible.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">No hay resultados para este filtro</p>
        )}
      </div>
    </div>
  )
}
