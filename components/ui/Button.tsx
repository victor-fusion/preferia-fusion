'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClass: Record<Variant, string> = {
  primary:   'feria-btn feria-btn-primary',
  secondary: 'feria-btn feria-btn-secondary',
  ghost:     'feria-btn feria-btn-ghost',
  danger:    'feria-btn feria-btn-danger',
}

const sizeClass: Record<Size, string> = {
  sm: 'feria-btn-sm',
  md: 'feria-btn-md',
  lg: 'feria-btn-lg',
}

const Spinner = () => (
  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75" />
  </svg>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion.button as any

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, className = '', children, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        disabled={disabled || loading}
        whileTap={{ scale: 0.97 }}
        className={[
          variantClass[variant],
          sizeClass[size],
          fullWidth ? 'w-full' : '',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? <Spinner /> : null}
        {children}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'
