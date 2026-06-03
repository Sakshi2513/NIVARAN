'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  trend,
  className = ''
}: DashboardCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">vs last month</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card with Chart
interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  iconColor?: string
  chart?: ReactNode
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  iconColor = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  chart
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% {changeLabel}
            </p>
          )}
        </div>
        {chart && <div className="w-24 h-12">{chart}</div>}
      </div>
    </div>
  )
}

// KPI Card Grid
interface KPICardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
}

export function KPICardGrid({ children, columns = 4 }: KPICardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  )
}