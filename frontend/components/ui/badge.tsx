'use client'

import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}

// Status-specific badges
export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    in_progress: { variant: 'info', label: 'In Progress' },
    resolved: { variant: 'success', label: 'Resolved' },
    rejected: { variant: 'error', label: 'Rejected' },
    escalated: { variant: 'purple', label: 'Escalated' }
  }

  const config = statusConfig[status.toLowerCase()] || { variant: 'default', label: status }

  return <Badge variant={config.variant} dot>{config.label}</Badge>
}

// Role-specific badges
export function RoleBadge({ role }: { role: string }) {
  const roleConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    citizen: { variant: 'info', label: 'Citizen' },
    officer: { variant: 'success', label: 'Officer' },
    department_head: { variant: 'purple', label: 'Department Head' },
    superadmin: { variant: 'error', label: 'Super Admin' }
  }

  const config = roleConfig[role.toLowerCase()] || { variant: 'default', label: role }

  return <Badge variant={config.variant} size="sm">{config.label}</Badge>
}