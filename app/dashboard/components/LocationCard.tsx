import { Card, CardHeader } from '@/components/ui/Card'

export function LocationCard() {
  const lat = 37.330306
  const lng = -5.901054

  const links = [
    {
      label: 'Google Maps',
      emoji: '🗺️',
      href: `https://www.google.com/maps?q=${lat},${lng}`,
      bg: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      label: 'Apple Maps',
      emoji: '🍎',
      href: `https://maps.apple.com/?ll=${lat},${lng}`,
      bg: 'bg-gray-50 border-gray-200 text-gray-700',
    },
    {
      label: 'Waze',
      emoji: '🚗',
      href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      bg: 'bg-sky-50 border-sky-200 text-sky-700',
    },
  ]

  return (
    <Card>
      <CardHeader icon="📍" title="Ubicación del evento" />
      <p className="text-sm text-text-muted mb-1 font-medium">Calle Risco, 186</p>
      <p className="text-sm text-text-muted mb-5">41500 · Alcalá de Guadaira, Sevilla</p>

      <div className="grid grid-cols-3 gap-2">
        {links.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-opacity hover:opacity-80 ${link.bg}`}
          >
            <span className="text-2xl">{link.emoji}</span>
            <span className="text-xs font-medium">{link.label}</span>
          </a>
        ))}
      </div>
    </Card>
  )
}
