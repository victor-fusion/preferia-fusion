import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: total },
    { count: confirmed },
    { count: pending },
    { count: unconfirmed },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('payment_status', 'confirmado'),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('payment_status', 'pago_enviado'),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('payment_status', 'sin_confirmar'),
  ])

  const t = total ?? 0
  const c = confirmed ?? 0
  const p = pending ?? 0
  const u = unconfirmed ?? 0
  const progressPct = t > 0 ? Math.round((c / t) * 100) : 0

  const metrics = [
    { label: 'Registrados', value: t, emoji: '👥', color: 'text-text' },
    { label: 'Confirmados', value: c, emoji: '✅', color: 'text-green-700' },
    { label: 'Pago enviado', value: p, emoji: '🟡', color: 'text-amber-700' },
    { label: 'Sin confirmar', value: u, emoji: '⬜', color: 'text-text-muted' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text italic">Panel de administración</h1>
        <p className="text-text-muted text-sm mt-0.5">Preferia Fusión 2026 · 17 de abril</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="card-gold p-4 text-center">
            <div className="text-2xl mb-1">{m.emoji}</div>
            <div className={`text-3xl font-bold font-display ${m.color}`}>{m.value}</div>
            <div className="text-xs text-text-muted mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="card-gold p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text">Confirmaciones</span>
          <span className="text-sm font-bold text-primary">{progressPct}%</span>
        </div>
        <div className="h-3 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">
          {c} de {t} personas han confirmado su asistencia
        </p>
      </div>
    </div>
  )
}
