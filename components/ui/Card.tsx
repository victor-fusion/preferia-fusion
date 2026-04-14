/* ── Card con estética Portada de Feria ──
   API:
     <Card icon="💸" title="Título" subtitle="Subtítulo opcional">
       contenido del body
     </Card>
   O sin header:
     <Card>{contenido}</Card>
   ── */

interface CardProps {
  children: React.ReactNode
  className?: string
  /** Si se pasa title, renderiza la cabecera roja con arco */
  title?: string
  icon?: string
  subtitle?: string
  /** accent ignorado — compatibilidad hacia atrás */
  accent?: boolean
}

export function Card({ children, className = '', title, icon, subtitle }: CardProps) {
  return (
    <div className={`feria-card ${className}`}>
      {title && (
        <div className="feria-card-header">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
            <h2
              className="font-display italic"
              style={{ fontSize: '1rem', fontWeight: 600, color: 'white', margin: 0 }}
            >
              {title}
            </h2>
          </div>
          {subtitle && (
            <p
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.65)',
                marginTop: 2,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="feria-card-body">{children}</div>
    </div>
  )
}

/** @deprecated Usa las props icon/title/subtitle de <Card> directamente */
export function CardHeader({ icon, title, subtitle }: { icon?: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
        <h2
          className="font-display italic"
          style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--feria-red)' }}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: '0.8rem', color: 'var(--feria-muted)' }}>{subtitle}</p>
      )}
    </div>
  )
}
