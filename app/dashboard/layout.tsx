import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Si el usuario existe en auth pero no tiene perfil (el trigger no disparó),
  // lo creamos con el cliente admin para saltarnos RLS.
  if (!profile) {
    const admin = createAdminClient()
    const { data: created } = await admin
      .from('profiles')
      .insert({
        id: user.id,
        full_name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split('@')[0] ??
          'Usuario',
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role: user.email === 'victor@fusionstartups.com' ? 'superadmin' : 'user',
      })
      .select('*')
      .single()
    profile = created
  }

  if (!profile) redirect('/')

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--feria-cream)' }}
    >
      <DashboardNav profile={profile} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
        {children}
      </main>
      <div className="h-3 stripes-green" />
    </div>
  )
}
