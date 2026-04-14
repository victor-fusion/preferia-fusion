import Link from 'next/link'
import { Countdown } from './components/Countdown'

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-bg overflow-hidden">
      {/* Franja superior */}
      <div className="h-3 stripes-red" />

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 relative">
        {/* Farolillo decorativo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-8 opacity-20 pointer-events-none select-none text-5xl">
          <span>🏮</span><span>🏮</span><span>🏮</span>
        </div>

        {/* Contenido principal */}
        <div className="w-full max-w-lg text-center z-10">
          {/* Emoji flamenco */}
          <div className="text-6xl mb-6">💃</div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary italic leading-tight mb-3">
            Preferia Fusión 2026
          </h1>

          <p className="text-text-muted text-lg sm:text-xl mb-2">
            La barbacoa previa a la mejor semana del año
          </p>

          <div className="flex items-center justify-center gap-2 text-text-muted text-sm mb-10">
            <span>📍</span>
            <span>Alcalá de Guadaira · 17 de abril · 14:30h</span>
          </div>

          {/* Cuenta atrás */}
          <div className="card-gold p-6 mb-10">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-4 font-medium">
              Faltan
            </p>
            <Countdown />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-primary text-white font-semibold text-lg shadow-sm hover:bg-primary-light transition-colors active:scale-[0.98]"
            >
              🎉 Unirme al evento
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-14 px-8 rounded-xl border border-primary text-primary font-semibold text-lg hover:bg-primary/5 transition-colors active:scale-[0.98]"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </main>

      {/* Franja decorativa inferior */}
      <div className="py-6 text-center">
        <p className="text-xs text-text-muted">Evento privado · Solo con invitación</p>
      </div>
      <div className="h-3 stripes-green" />
    </div>
  )
}
