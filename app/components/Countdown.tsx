'use client'

import { useEffect, useState } from 'react'

const TARGET = new Date('2026-04-17T14:30:00+02:00').getTime()

function getTimeLeft() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
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

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {['Días', 'Horas', 'Min', 'Seg'].map(label => (
          <div key={label} className="flex flex-col items-center">
            <div className="text-3xl sm:text-4xl font-bold font-display text-primary tabular-nums w-14 text-center">
              --
            </div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>
    )
  }

  const units = [
    { value: time.days, label: 'Días' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {units.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="text-3xl sm:text-4xl font-bold font-display text-primary tabular-nums w-14 text-center">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-text-muted mt-1 uppercase tracking-wide">{label}</div>
        </div>
      ))}
    </div>
  )
}
