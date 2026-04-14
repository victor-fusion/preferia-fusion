import { createClient } from '@/lib/supabase/server'
import { NormsEditor } from '../components/NormsEditor'

export default async function NormasPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('norms').select('*').order('sort_order')

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text italic">Normas del evento</h1>
      <NormsEditor initialNorms={data ?? []} />
    </div>
  )
}
