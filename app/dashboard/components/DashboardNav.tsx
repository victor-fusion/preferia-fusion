'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/database.types'

export function DashboardNav({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isAdmin = profile.role === 'admin' || profile.role === 'superadmin'

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-20">
      {/* Franja top */}
      <div className="h-1.5 stripes-red" />
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-display text-lg font-bold text-primary italic">
          🎡 Preferia Fusión
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-medium text-secondary border border-secondary rounded-lg px-3 py-1.5 hover:bg-secondary/5 transition-colors"
            >
              Admin
            </Link>
          )}
          <div
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold cursor-default"
            title={profile.full_name}
          >
            {initials}
          </div>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
