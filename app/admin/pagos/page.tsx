import { createClient } from '@/lib/supabase/server'
import { PaymentTable } from '../components/PaymentTable'

export default async function PagosPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, created_at, attendance(payment_status, payment_confirmed_at, created_at)')
    .order('full_name')

  const rows = (data ?? []).map(p => ({
    id: p.id,
    full_name: p.full_name,
    created_at: p.created_at,
    payment_status: (p.attendance as unknown as Array<{ payment_status: string; payment_confirmed_at: string | null; created_at: string }>)?.[0]?.payment_status ?? 'sin_confirmar',
    payment_confirmed_at: (p.attendance as unknown as Array<{ payment_status: string; payment_confirmed_at: string | null; created_at: string }>)?.[0]?.payment_confirmed_at ?? null,
    attendance_created_at: (p.attendance as unknown as Array<{ payment_status: string; payment_confirmed_at: string | null; created_at: string }>)?.[0]?.created_at ?? null,
  }))

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text italic">Gestión de pagos</h1>
      <PaymentTable initialRows={rows} />
    </div>
  )
}
