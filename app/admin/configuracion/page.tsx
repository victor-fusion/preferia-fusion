import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EventSettingsForm } from '../components/EventSettingsForm'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase.from('profiles').select('id, role').eq('id', user.id).single()
  if ((me as { role: string } | null)?.role !== 'superadmin') redirect('/admin')

  const { data: settings } = await supabase.from('event_settings').select('*').eq('id', 1).single()

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text italic">Configuración del evento</h1>
      <EventSettingsForm initialSettings={settings} />
    </div>
  )
}
