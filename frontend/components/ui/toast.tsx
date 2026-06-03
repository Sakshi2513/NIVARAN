'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useToastStore, ToastType } from '@/store/toast-store'

interface ToastContainerProps {
  children?: ReactNode
}

export function ToastContainer({}: ToastContainerProps) {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: { id: string; type: ToastType; message: string }
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const bgColors: Record<ToastType, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  }

  const icons: Record<ToastType, ReactNode> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div
      className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px] animate-slide-in`}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold">
        {icons[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Export toast helper functions
export const toast = {
  success: (message: string) => useToastStore.getState().success(message),
  error: (message: string) => useToastStore.getState().error(message),
  warning: (message: string) => useToastStore.getState().warning(message),
  info: (message: string) => useToastStore.getState().info(message)
}