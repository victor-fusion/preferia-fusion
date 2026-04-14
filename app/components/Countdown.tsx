'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TARGET = new Date('2026-04-17T14:30:00+02:00').getTime()

function getTimeLeft() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function FlipNumber({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Número con animación flip al cambiar */}
      <div
        style={{
          position: 'relative',
          width: 56,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--feria-cream)',
          borderRadius: 10,
          border: '1.5px solid var(--feria-border)',
          boxShadow: '0 2px 8px rgba(200,150,58,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Línea central estilo flip-clock */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(200,150,58,0.25)',
            zIndex: 1,
          }}
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0,   opacity: 1 }}
            exit={{    rotateX:  90,  opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.9rem',
              fontWeight: 700,
              color: 'var(--feria-red)',
              fontVariantNumeric: 'tabular-nums',
              display: 'block',
              lineHeight: 1,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        style={{
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'var(--feria-muted)',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  )
}

export function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { value: String(time.days).padStart(2, '0'),    label: 'Días' },
    { value: String(time.hours).padStart(2, '0'),   label: 'Horas' },
    { value: String(time.minutes).padStart(2, '0'), label: 'Min' },
    { value: String(time.seconds).padStart(2, '0'), label: 'Seg' },
  ]

  if (!mounted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {['Días', 'Horas', 'Min', 'Seg'].map(label => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 56, height: 52,
                background: 'var(--feria-cream)',
                borderRadius: 10,
                border: '1.5px solid var(--feria-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.9rem',
                fontWeight: 700,
                color: 'var(--feria-border)',
              }}
            >
              --
            </div>
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--feria-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
      {units.map(({ value, label }) => (
        <FlipNumber key={label} value={value} label={label} />
      ))}
    </div>
  )
}
