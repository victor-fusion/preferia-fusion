'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('No se pudo actualizar la contraseña. El enlace puede haber caducado.')
      setLoading(false)
    } else {
      setDone(true)
      // Redirigir al dashboard tras un momento
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--feria-cream)' }}>
      <div className="h-4 stripes-red" />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-6"
        >
          <h1
            className="font-display italic font-bold"
            style={{ fontSize: '2rem', color: 'var(--feria-red)' }}
          >
            Preferia Fusión
          </h1>
          <p style={{ color: 'var(--feria-muted)', fontSize: '0.85rem', marginTop: 2 }}>
            La barbacoa previa a la mejor semana del año
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-full max-w-sm auth-card"
        >
          <div className="auth-card-header">
            <div
              className="font-display italic font-semibold"
              style={{ fontSize: '1.35rem', color: 'white' }}
            >
              Nueva contraseña
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              Elige una contraseña segura
            </div>
          </div>

          <div className="auth-card-body">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
                <p style={{ fontWeight: 600, color: 'var(--feria-dark)', fontSize: '0.95rem' }}>
                  ¡Contraseña actualizada!
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--feria-muted)', marginTop: 8 }}>
                  Redirigiendo al panel…
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { id: 'password', label: 'Nueva contraseña', value: password, onChange: setPassword },
                  { id: 'confirm',  label: 'Repetir contraseña', value: confirm,  onChange: setConfirm  },
                ].map(field => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--feria-dark)', marginBottom: 6, letterSpacing: '0.04em' }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type="password"
                      placeholder="••••••••"
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      required
                      autoComplete={field.id === 'password' ? 'new-password' : 'new-password'}
                      className={`feria-input${error ? ' feria-input--error' : ''}`}
                    />
                  </div>
                ))}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '0.75rem', color: 'var(--feria-error)', marginTop: -8 }}
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="feria-btn feria-btn-primary feria-btn-lg"
                  style={{ width: '100%', marginTop: 4 }}
                >
                  {loading ? (
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75"/>
                    </svg>
                  ) : null}
                  Guardar contraseña
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <div className="h-4 stripes-green" />
    </div>
  )
}
