interface CardProps {
  children: React.ReactNode
  className?: string
  accent?: boolean
}

export function Card({ children, className = '', accent = false }: CardProps) {
  return (
    <div
      className={[
        'card-gold p-5 sm:p-6',
        accent ? 'border-t-4 border-t-primary' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  icon?: string
  title: string
  subtitle?: string
}

export function CardHeader({ icon, title, subtitle }: CardHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-text-muted">{subtitle}</p>
      )}
    </div>
  )
}
