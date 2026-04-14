import { Card } from '@/components/ui/Card'

export function LocationCard() {
  const lat = 37.330306
  const lng = -5.901054

  const links = [
    { label: 'Google Maps', emoji: '🗺️', href: `https://www.google.com/maps?q=${lat},${lng}` },
    { label: 'Apple Maps',  emoji: '🍎', href: `https://maps.apple.com/?ll=${lat},${lng}` },
    { label: 'Waze',        emoji: '🚗', href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` },
  ]

  return (
    <Card icon="📍" title="Ubicación del evento">
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--feria-dark)', marginBottom: 2 }}>
        Calle Risco, 186
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--feria-muted)', marginBottom: 18 }}>
        41500 · Alcalá de Guadaira, Sevilla
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {links.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 8px',
              borderRadius: 12,
              border: '1.5px solid var(--feria-border)',
              background: 'var(--feria-gold-pale)',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{link.emoji}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--feria-dark)' }}>{link.label}</span>
          </a>
        ))}
      </div>
    </Card>
  )
}
