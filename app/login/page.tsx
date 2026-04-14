'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    const origin = window.location.origin
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` },
    })
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

            {/* Separador */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div className="gold-rule" style={{ flex: 1 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--feria-muted)' }}>o</span>
              <div className="gold-rule" style={{ flex: 1 }} />
            </div>

            {/* Google */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              whileTap={{ scale: 0.97 }}
              className="feria-btn feria-btn-ghost feria-btn-lg"
              style={{ width: '100%' }}
            >
              {googleLoading
                ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75"/></svg>
                : <GoogleIcon />}
              Continuar con Google
            </motion.button>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--feria-muted)', marginTop: 20 }}>
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
