interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--feria-dark)',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'feria-input',
          error ? 'feria-input--error' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p style={{ fontSize: '0.75rem', color: 'var(--feria-error)' }}>{error}</p>
      )}
    </div>
  )
}
