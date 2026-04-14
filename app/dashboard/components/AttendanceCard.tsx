'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Attendance, EventSettings } from '@/lib/types/database.types'

interface Props {
  attendance: Attendance | null
  settings: EventSettings | null
  userId: string
  userName: string
}

const statusInfo = {
  sin_confirmar: { badge: '⬜ Sin confirmar', className: 'badge-unconfirmed' },
  pago_enviado: { badge: '🟡 Pago enviado', className: 'badge-pending' },
  confirmado: { badge: '✅ Confirmado', className: 'badge-confirmed' },
}

export function AttendanceCard({ attendance, settings, userId, userName }: Props) {
  const status = attendance?.payment_status ?? 'sin_confirmar'
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(status)

  async function handleBizumSent() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('attendance')
      .update({ payment_status: 'pago_enviado' })
      .eq('user_id', userId)
    setCurrentStatus('pago_enviado')
    setLoading(false)
  }

  const info = statusInfo[currentStatus]

  return (
    <Card accent>
      <CardHeader icon="💸" title="Confirmación y pago" subtitle="Precio: 20€ por persona" />

      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${info.className}`}>
          {info.badge}
        </span>
      </div>

      {currentStatus === 'confirmado' ? (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
          <p className="text-green-700 font-medium">
            ✅ Tu pago ha sido verificado. ¡Estás dentro!
          </p>
        </div>
      ) : currentStatus === 'pago_enviado' ? (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-amber-800 text-sm">
            🕐 Hemos recibido tu aviso. El organizador verificará tu pago pronto.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-bg border border-border p-4 flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Datos para el Bizum:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Número</span>
              <span className="text-sm font-mono font-bold text-text">
                {settings?.bizum_number || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Titular</span>
              <span className="text-sm font-medium text-text">
                {settings?.bizum_holder || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Concepto</span>
              <span className="text-sm font-medium text-primary">
                Preferia {userName.split(' ')[0]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Importe</span>
              <span className="text-sm font-bold text-text">20,00 €</span>
            </div>
          </div>

          <Button onClick={handleBizumSent} loading={loading} fullWidth size="lg">
            Ya he hecho el Bizum ✅
          </Button>
        </div>
      )}
    </Card>
  )
}
