import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Convenience methods
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))
    
    // Auto-remove after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, duration)
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  },
  
  clearToasts: () => {
    set({ toasts: [] })
  },
  
  success: (message, duration) => {
    set((state) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { id, type: 'success', message, duration }
      
      setTimeout(() => {
        useToastStore.getState().removeToast(id)
      }, duration || 5000)
      
      return { toasts: [...state.toasts, newToast] }
    })
  },
  
  error: (message, duration) => {
    set((state) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { id, type: 'error', message, duration }
      
      setTimeout(() => {
        useToastStore.getState().removeToast(id)
      }, duration || 5000)
      
      return { toasts: [...state.toasts, newToast] }
    })
  },
  
  warning: (message, duration) => {
    set((state) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { id, type: 'warning', message, duration }
      
      setTimeout(() => {
        useToastStore.getState().removeToast(id)
      }, duration || 5000)
      
      return { toasts: [...state.toasts, newToast] }
    })
  },
  
  info: (message, duration) => {
    set((state) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { id, type: 'info', message, duration }
      
      setTimeout(() => {
        useToastStore.getState().removeToast(id)
      }, duration || 5000)
      
      return { toasts: [...state.toasts, newToast] }
    })
  }
}))