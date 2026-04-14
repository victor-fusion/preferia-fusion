import { createClient } from '@/lib/supabase/server'
import { DrinkChart } from '../components/DrinkChart'

export default async function BebidasPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('drink_totals')
    .select('*')

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text italic">Distribución de bebidas</h1>
      <p className="text-sm text-text-muted">Media de preferencias de todos los asistentes que han guardado sus elecciones.</p>
      <DrinkChart data={data ?? []} />
    </div>
  )
}
