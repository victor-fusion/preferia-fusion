'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Attendance, EventSettings } from '@/lib/types/database.types'

interface Props {
  attendance: Attendance | null
  settings: EventSettings | null
  userId: string
  userName: string
}

const statusInfo = {
  sin_confirmar: { label: 'Sin confirmar', className: 'badge-unconfirmed' },
  pago_enviado:  { label: 'Pago enviado',  className: 'badge-pending' },
  confirmado:    { label: 'Confirmado',     className: 'badge-confirmed' },
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

  const info = statusInfo[currentStatus as keyof typeof statusInfo]

  return (
    <Card icon="💸" title="Confirmación y pago" subtitle="Precio: 20€ por persona">

      <div style={{ marginBottom: 16 }}>
        <span className={info.className} style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
          {currentStatus === 'sin_confirmar' ? '⬜' : currentStatus === 'pago_enviado' ? '🟡' : '✅'}&nbsp;{info.label}
        </span>
      </div>

      {currentStatus === 'confirmado' ? (
        <div
          style={{
            borderRadius: 12,
            background: 'rgba(42,107,60,0.07)',
            border: '1px solid rgba(42,107,60,0.3)',
            padding: '14px 16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--feria-green)', fontWeight: 600, fontSize: '0.9rem' }}>
            ✅ Tu pago ha sido verificado. ¡Estás dentro!
          </p>
        </div>

      ) : currentStatus === 'pago_enviado' ? (
        <div
          style={{
            borderRadius: 12,
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            padding: '14px 16px',
          }}
        >
          <p style={{ color: '#92400E', fontSize: '0.875rem' }}>
            🕐 Hemos recibido tu aviso. El organizador verificará tu pago pronto.
          </p>
        </div>

      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Datos Bizum */}
          <div
            style={{
              borderRadius: 12,
              background: 'var(--feria-gold-pale)',
              border: '1px solid var(--feria-border)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--feria-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Datos para el Bizum
            </p>
            {[
              { label: 'Número',   value: settings?.bizum_number || '—' },
              { label: 'Titular',  value: settings?.bizum_holder || '—' },
              { label: 'Concepto', value: `Preferia ${userName.split(' ')[0]}` },
              { label: 'Importe',  value: '20,00 €' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--feria-muted)' }}>{row.label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--feria-dark)' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <Button onClick={handleBizumSent} loading={loading} fullWidth size="lg">
            Ya he hecho el Bizum ✅
          </Button>
        </div>
      )}
    </Card>
  )
}
