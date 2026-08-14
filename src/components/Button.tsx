import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; wide?: boolean }

export function Button({ variant = 'primary', wide = false, className = '', ...props }: Props) {
  return <button className={`button button-${variant} ${wide ? 'button-wide' : ''} ${className}`} {...props} />
}
