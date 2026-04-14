'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { UserRole } from '@/lib/types/database.types'
import { sendPasswordReset } from '../actions'

interface ProfileRow {
  id: string
  full_name: string
  role: UserRole
  created_at: string
}

const roleLabels: Record<UserRole, string> = {
  superadmin: '⭐ Superadmin',
  admin: '🔧 Admin',
  user: '👤 Usuario',
}

export function AdminManager({
  initialProfiles,
  currentUserId,
}: {
  initialProfiles: ProfileRow[]
  currentUserId: string
}) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [loading, setLoading] = useState<string | null>(null)
  const [resetting, setResetting] = useState<string | null>(null)
  const [resetOk, setResetOk] = useState<string | null>(null)

  async function toggleRole(id: string, current: UserRole) {
    if (id === currentUserId) return
    const newRole: UserRole = current === 'admin' ? 'user' : 'admin'
    setLoading(id)
    const supabase = createClient()
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p))
    setLoading(null)
  }

  async function handleResetPassword(id: string) {
    setResetting(id)
    setResetOk(null)
    const { error } = await sendPasswordReset(id)
    setResetting(null)
    if (!error) {
      setResetOk(id)
      setTimeout(() => setResetOk(null), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {profiles.map(p => (
        <div key={p.id} className="card-gold p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="font-medium text-text">{p.full_name}</p>
            <span className="text-xs text-text-muted">{roleLabels[p.role]}</span>
          </div>
          {p.id !== currentUserId && p.role !== 'superadmin' && (
            <Button
              size="sm"
              variant={p.role === 'admin' ? 'ghost' : 'secondary'}
              loading={loading === p.id}
              onClick={() => toggleRole(p.id, p.role)}
            >
              {p.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
            </Button>
          )}
          {p.id !== currentUserId && (
            resetOk === p.id ? (
              <span className="text-xs text-secondary font-medium">✓ Email enviado</span>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                loading={resetting === p.id}
                onClick={() => handleResetPassword(p.id)}
              >
                Reset contraseña
              </Button>
            )
          )}
          {p.id === currentUserId && (
            <span className="text-xs text-text-muted">Tú</span>
          )}
        </div>
      ))}
    </div>
  )
}
