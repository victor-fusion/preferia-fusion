'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Countdown } from './components/Countdown'

/* ── Silueta de la Portada de Feria de Sevilla 2026 ── */
function PortadaSVG() {
  return (
    <svg
      viewBox="0 0 640 225"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', maxWidth: 680 }}
    >
      {/* ── Línea de base ── */}
      <line x1="0" y1="212" x2="640" y2="212" stroke="#C8963A" strokeWidth="2.5" />

      {/* ══ TORRE FINA IZQUIERDA ══ */}
      <rect x="5" y="96" width="30" height="116" rx="2" fill="#9B2335" />
      <line x1="5" y1="124" x2="35" y2="124" stroke="#C8963A" strokeWidth="1.5" />
      <line x1="5" y1="152" x2="35" y2="152" stroke="#C8963A" strokeWidth="1.5" />
      <line x1="5" y1="180" x2="35" y2="180" stroke="#C8963A" strokeWidth="1.5" />
      <path d="M 3 98 Q 20 54 37 98" fill="#C8963A" />
      <circle cx="20" cy="51" r="5" fill="#C8963A" />

      {/* ══ TORRE PRINCIPAL IZQUIERDA ══ */}
      <rect x="48" y="58" width="72" height="154" rx="3" fill="#9B2335" />
      <line x1="48" y1="98"  x2="120" y2="98"  stroke="#C8963A" strokeWidth="1.5" />
      <line x1="48" y1="130" x2="120" y2="130" stroke="#C8963A" strokeWidth="1.5" />
      <line x1="48" y1="164" x2="120" y2="164" stroke="#C8963A" strokeWidth="1.5" />
      {/* Ventana arco */}
      <path d="M 65 86 L 65 120 Q 84 62 103 120 L 103 86 Z" fill="#A8CCE4" opacity="0.85" />
      <path d="M 65 86 Q 84 62 103 86" stroke="#C8963A" strokeWidth="1.2" fill="none" />
      {/* Chapitel */}
      <path d="M 46 60 Q 84 14 122 60" fill="#C8963A" stroke="#C8963A" />
      <circle cx="84" cy="11" r="7" fill="#C8963A" />

      {/* ══ ARCO PEQUEÑO IZQUIERDO ══ */}
      <path d="M 120 212 L 120 158 Q 152 110 184 158 L 184 212" stroke="#9B2335" strokeWidth="5" fill="none" />
      <path d="M 123 212 L 123 160 Q 152 115 181 160 L 181 212" stroke="#C8963A" strokeWidth="1.5" fill="none" opacity="0.55" />
      <circle cx="152" cy="110" r="3.5" fill="#C8963A" />

      {/* ══ ARCO MEDIANO IZQUIERDO ══ */}
      <path d="M 182 212 L 182 138 Q 238 76 294 138 L 294 212" stroke="#9B2335" strokeWidth="6" fill="none" />
      <path d="M 186 212 L 186 141 Q 238 82 290 141 L 290 212" stroke="#C8963A" strokeWidth="1.5" fill="none" opacity="0.55" />
      {/* Relleno azul suave */}
      <path d="M 188 212 L 188 143 Q 238 86 288 143 L 288 212" fill="rgba(91,158,201,0.10)" />
      <circle cx="238" cy="77" r="4" fill="#C8963A" />

      {/* ══ ARCO CENTRAL (La Portada) ══ */}
      <path d="M 258 212 L 258 88 Q 350 6 442 88 L 442 212" stroke="#9B2335" strokeWidth="9" fill="none" strokeLinejoin="round" />
      {/* Relleno arco central */}
      <path d="M 267 212 L 267 93 Q 350 16 433 93 L 433 212" fill="rgba(91,158,201,0.13)" />
      {/* Borde dorado interior */}
      <path d="M 268 212 L 268 94 Q 350 18 432 94 L 432 212" stroke="#C8963A" strokeWidth="2" fill="none" opacity="0.65" />
      {/* Banda horizontal ornamental */}
      <path d="M 260 146 Q 350 116 440 146" stroke="#C8963A" strokeWidth="2.5" fill="none" />
      <circle cx="350" cy="117" r="5.5" fill="#C8963A" />
      <circle cx="304" cy="133" r="3"   fill="#C8963A" />
      <circle cx="396" cy="133" r="3"   fill="#C8963A" />
      {/* Ventana central */}
      <path d="M 305 90 L 305 145 Q 350 62 395 145 L 395 90 Z" fill="rgba(91,158,201,0.2)" />
      <path d="M 305 90 Q 350 62 395 90" stroke="#C8963A" strokeWidth="1.5" fill="none" />
      {/* Cúpula central */}
      <ellipse cx="350" cy="9" rx="26" ry="18" fill="#9B2335" stroke="#C8963A" strokeWidth="2.5" />
      <circle  cx="350" cy="-1" r="7"  fill="#C8963A" />
      <line x1="324" y1="9" x2="376" y2="9" stroke="#C8963A" strokeWidth="1.2" opacity="0.6" />

      {/* ══ ARCO MEDIANO DERECHO ══ */}
      <path d="M 406 138 Q 462 76 518 138 L 518 212" stroke="#9B2335" strokeWidth="6" fill="none" />
      <path d="M 410 141 Q 462 82 514 141 L 514 212" stroke="#C8963A" strokeWidth="1.5" fill="none" opacity="0.55" />
      <path d="M 412 143 Q 462 86 512 143 L 512 212" fill="rgba(91,158,201,0.10)" />
      <circle cx="462" cy="77" r="4" fill="#C8963A" />

      {/* ══ ARCO PEQUEÑO DERECHO ══ */}
      <path d="M 456 158 Q 488 110 520 158 L 520 212" stroke="#9B2335" strokeWidth="5" fill="none" />
      <path d="M 459 160 Q 488 115 517 160 L 517 212" stroke="#C8963A" strokeWidth="1.5" fill="none" opacity="0.55" />
      <circle cx="488" cy="110" r="3.5" fill="#C8963A" />

      {/* ══ TORRE PRINCIPAL DERECHA ══ */}
      <rect x="520" y="58" width="72" height="154" rx="3" fill="#9B2335" />
      <line x1="520" y1="98"  x2="592" y2="98"  stroke="#C8963A" strokeWidth="1.5" />
      <line x1="520" y1="130" x2="592" y2="130" stroke="#C8963A" strokeWidth="1.5" />
      <line x1="520" y1="164" x2="592" y2="164" stroke="#C8963A" strokeWidth="1.5" />
      <path d="M 537 86 L 537 120 Q 556 62 575 120 L 575 86 Z" fill="#A8CCE4" opacity="0.85" />
      <path d="M 537 86 Q 556 62 575 86" stroke="#C8963A" strokeWidth="1.2" fill="none" />
      <path d="M 518 60 Q 556 14 594 60" fill="#C8963A" stroke="#C8963A" />
      <circle cx="556" cy="11" r="7" fill="#C8963A" />

      {/* ══ TORRE FINA DERECHA ══ */}
      <rect x="605" y="96" width="30" height="116" rx="2" fill="#9B2335" />
      <line x1="605" y1="124" x2="635" y2="124" stroke="#C8963A" strokeWidth="1.5" />
      <line x1="605" y1="152" x2="635" y2="152" stroke="#C8963A" strokeWidth="1.5" />
      <line x1="605" y1="180" x2="635" y2="180" stroke="#C8963A" strokeWidth="1.5" />
      <path d="M 603 98 Q 620 54 637 98" fill="#C8963A" />
      <circle cx="620" cy="51" r="5" fill="#C8963A" />

      {/* ── Detalles decorativos en los arcos ── */}
      <circle cx="152" cy="212" r="3" fill="#C8963A" opacity="0.5" />
      <circle cx="238" cy="212" r="3" fill="#C8963A" opacity="0.5" />
      <circle cx="462" cy="212" r="3" fill="#C8963A" opacity="0.5" />
      <circle cx="488" cy="212" r="3" fill="#C8963A" opacity="0.5" />
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const, delay: d },
  }),
}

export default function LandingPage() {
  return (
    <div
      className="min-h-dvh flex flex-col overflow-hidden"
      style={{ background: 'var(--feria-cream)' }}
    >
      {/* Franja superior */}
      <div className="h-4 stripes-red" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6 gap-0">

        {/* ── Silueta Portada ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.90, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl px-2 mb-0"
        >
          <PortadaSVG />
        </motion.div>

        {/* ── Título ── */}
        <motion.div
          className="text-center mb-2"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0.25}
        >
          <h1
            className="font-display italic font-bold leading-none"
            style={{
              fontSize: 'clamp(2.4rem, 8vw, 4.5rem)',
              color: 'var(--feria-red)',
              textShadow: '0 2px 12px rgba(155,35,53,0.12)',
            }}
          >
            Preferia Fusión
          </h1>
          <div
            className="font-display font-semibold tracking-widest mt-1"
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.75rem)',
              color: 'var(--feria-gold)',
              letterSpacing: '0.25em',
            }}
          >
            2026
          </div>
        </motion.div>

        {/* ── Subtítulo ── */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0.35}
          style={{ color: 'var(--feria-muted)', fontSize: '1.05rem' }}
          className="mb-3 text-center"
        >
          La barbacoa previa a la mejor semana del año
        </motion.p>

        {/* ── Ubicación / fecha ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0.45}
          className="mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(200,150,58,0.1)',
              border: '1px solid rgba(200,150,58,0.35)',
            }}
          >
            <span style={{ color: 'var(--feria-gold)' }}>📍</span>
            <span style={{ color: 'var(--feria-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
              Alcalá de Guadaira · 17 de abril · 14:30h
            </span>
          </div>
        </motion.div>

        {/* ── Cuenta atrás ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0.55}
          className="w-full max-w-sm mb-7"
        >
          <div className="portada-countdown">
            <div className="portada-countdown-header">
              <span
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                }}
              >
                Faltan
              </span>
            </div>
            <div className="portada-countdown-body">
              <Countdown />
            </div>
          </div>
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0.7}
          className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm sm:max-w-none"
        >
          <Link
            href="/signup"
            className="feria-btn feria-btn-primary feria-btn-lg"
          >
            <span>💃</span> Unirme al evento
          </Link>
          <Link
            href="/login"
            className="feria-btn feria-btn-ghost feria-btn-lg"
          >
            Ya tengo cuenta
          </Link>
        </motion.div>
      </main>

      {/* ── Pie ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="py-4 text-center"
        style={{ color: 'var(--feria-muted)', fontSize: '0.75rem', letterSpacing: '0.08em' }}
      >
        Evento privado · Solo con invitación
      </motion.div>
      <div className="h-4 stripes-green" />
    </div>
  )
}
