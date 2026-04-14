import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminManager } from '../components/AdminManager'

export default async function AdminsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase.from('profiles').select('id, role').eq('id', user.id).single()
  if ((me as { role: string } | null)?.role !== 'superadmin') redirect('/admin')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('full_name')

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text italic">Gestión de admins</h1>
      <p className="text-sm text-text-muted">Solo el superadmin puede gestionar roles.</p>
      <AdminManager
        initialProfiles={(profiles ?? []) as Array<{ id: string; full_name: string; role: 'superadmin' | 'admin' | 'user'; created_at: string }>}
        currentUserId={user.id}
      />
    </div>
  )
}
