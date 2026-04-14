'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const origin = window.location.origin
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message === 'User already registered'
        ? 'Ya existe una cuenta con ese email'
        : 'Error al crear la cuenta. Inténtalo de nuevo.')
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    const origin = window.location.origin
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col bg-bg">
        <div className="h-2 stripes-red" />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm card-gold p-6 sm:p-8 text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="font-display text-xl font-semibold text-text mb-2">
              Revisa tu email
            </h2>
            <p className="text-text-muted text-sm">
              Te hemos enviado un link de confirmación a{' '}
              <strong>{email}</strong>. Pulsa el enlace para activar tu cuenta.
            </p>
          </div>
        </div>
        <div className="h-2 stripes-green" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <div className="h-2 stripes-red" />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🎡</div>
          <h1 className="font-display text-3xl font-bold text-primary italic">
            Preferia Fusión
          </h1>
          <p className="text-text-muted text-sm mt-1">La barbacoa previa a la mejor semana del año</p>
        </div>

        <div className="w-full max-w-sm card-gold p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-text mb-6">
            Unirme al evento
          </h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              id="fullName"
              label="Nombre completo"
              type="text"
              placeholder="María García"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              error={error}
            />
            <Button type="submit" loading={loading} fullWidth size="lg">
              Crear cuenta
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            type="button"
            variant="ghost"
            fullWidth
            size="lg"
            loading={googleLoading}
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </Button>

          <p className="text-center text-sm text-text-muted mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      <div className="h-2 stripes-green" />
    </div>
  )
}
