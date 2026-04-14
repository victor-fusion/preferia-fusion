import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/dashboard')
  }

  const isSuperadmin = profile.role === 'superadmin'

  const navLinks = [
    { href: '/admin', label: '📊 Métricas' },
    { href: '/admin/pagos', label: '💸 Pagos' },
    { href: '/admin/bebidas', label: '🍻 Bebidas' },
    { href: '/admin/playlist', label: '🎶 Playlist' },
    { href: '/admin/normas', label: '📜 Normas' },
    ...(isSuperadmin ? [
      { href: '/admin/admins', label: '👤 Admins' },
      { href: '/admin/configuracion', label: '⚙️ Config' },
    ] : []),
  ]

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <div className="h-1.5 stripes-red" />
      <header className="bg-surface border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-display text-lg font-bold text-primary italic">
            🎡 Admin
          </Link>
          <Link href="/dashboard" className="text-sm text-text-muted hover:text-text transition-colors">
            ← Mi dashboard
          </Link>
        </div>
        <nav className="max-w-5xl mx-auto px-4 pb-0 overflow-x-auto">
          <div className="flex gap-1 min-w-max pb-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
      <div className="h-2 stripes-green" />
    </div>
  )
}
