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
    <header className="feria-nav">
      <div
        style={{
          maxWidth: 672,
          margin: '0 auto',
          padding: '0 16px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-display italic font-bold"
          style={{ fontSize: '1.2rem', color: 'var(--feria-red)', textDecoration: 'none' }}
        >
          Preferia Fusión
        </Link>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAdmin && (
            <Link
              href="/admin"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--feria-green)',
                border: '1.5px solid var(--feria-green)',
                borderRadius: 20,
                padding: '4px 12px',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
            >
              Panel admin
            </Link>
          )}

          {/* Avatar */}
          <div
            title={profile.full_name}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--feria-red-dark), var(--feria-red))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: '2px solid var(--feria-gold)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <button
            onClick={handleSignOut}
            disabled={loading}
            style={{
              fontSize: '0.8rem',
              color: 'var(--feria-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'color 0.15s',
            }}
          >
            {loading ? '...' : 'Salir'}
          </button>
        </div>
      </div>
    </header>
  )
}
