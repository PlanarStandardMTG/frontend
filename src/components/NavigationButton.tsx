import React from 'react'
import { useNavigate } from 'react-router-dom'

type NavigationButtonProps = {
  to?: string
  href?: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function NavigationButton({
  to,
  href,
  children,
  variant = 'primary',
}: NavigationButtonProps) {
  const navigate = useNavigate()

  const baseClasses =
    'inline-flex items-center justify-center w-full px-6 py-3 font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40'

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
    secondary:
      'bg-gray-800 hover:bg-gray-700 text-white ring-1 ring-white/20',
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variants[variant]}`}
      >
        {children}
      </a>
    )
  }

  if (to) {
    return (
      <button
        onClick={() => navigate(to)}
        className={`${baseClasses} ${variants[variant]}`}
      >
        {children}
      </button>
    )
  }

  return null
}
