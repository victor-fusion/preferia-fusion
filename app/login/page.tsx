'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--feria-cream)' }}
    >
      <div className="h-4 stripes-red" />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">

        {/* ── Logo sobre la tarjeta ── */}
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

        {/* ── Tarjeta con cabecera en arco ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="w-full max-w-sm auth-card"
        >
          {/* Header rojo con decoración de arco */}
          <div className="auth-card-header">
            <div
              className="font-display italic font-semibold"
              style={{ fontSize: '1.35rem', color: 'white' }}
            >
              Iniciar sesión
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              Evento privado · Solo con invitación
            </div>
          </div>

          {/* Body */}
          <div className="auth-card-body">
            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label
                  htmlFor="email"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--feria-dark)', marginBottom: 6, letterSpacing: '0.04em' }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={`feria-input${error ? ' feria-input--error' : ''}`}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--feria-dark)', marginBottom: 6, letterSpacing: '0.04em' }}
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`feria-input${error ? ' feria-input--error' : ''}`}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '0.75rem', color: 'var(--feria-error)', marginTop: 5 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

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
                Entrar
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--feria-muted)', marginTop: 20 }}>
              <Link
                href="/forgot-password"
                style={{ color: 'var(--feria-muted)', fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--feria-muted)', marginTop: 8 }}>
              ¿No tienes cuenta?{' '}
              <Link
                href="/signup"
                style={{ color: 'var(--feria-red)', fontWeight: 600 }}
              >
                Regístrate
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="h-4 stripes-green" />
    </div>
  )
}
