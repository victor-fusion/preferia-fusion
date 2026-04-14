interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'h-12 w-full rounded-xl border bg-surface px-4 text-text text-base',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold',
          'transition-colors',
          error
            ? 'border-error focus:ring-error'
            : 'border-border',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
