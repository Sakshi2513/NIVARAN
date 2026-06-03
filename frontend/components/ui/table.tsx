'use client'

import { ReactNode } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (field: string) => void
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  sortField,
  sortOrder,
  onSort
}: TableProps<T>) {
  if (loading) {
    return <TableSkeleton columns={columns.length} rows={5} />
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400
                  ${column.sortable ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white' : ''}
                  ${column.className || ''}
                `}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortField === column.key && (
                    sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={String(row[keyField])}
              className={`
                border-b border-gray-100 dark:border-gray-800
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                transition-colors
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-4 py-3 text-sm text-gray-700 dark:text-gray-300
                    ${column.className || ''}
                  `}
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Table Skeleton for loading state
function TableSkeleton({ columns, rows }: { columns: number; rows: number }) {
  return (
    <div className="w-full">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-3">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPages?: number
}

export function Pagination({ currentPage, totalPages, onPageChange, showPages = 5 }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const half = Math.floor(showPages / 2)
    
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1)
    }
    
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page !== 'number'}
          className={`
            px-3 py-1 rounded-lg text-sm
            ${page === currentPage 
              ? 'bg-blue-600 text-white' 
              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            ${typeof page !== 'number' ? 'cursor-default' : ''}
          `}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Next
      </button>
    </div>
  )
}