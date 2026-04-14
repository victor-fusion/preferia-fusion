import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <DashboardNav profile={profile} />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
        {children}
      </main>
      <div className="h-2 stripes-green" />
    </div>
  )
}
