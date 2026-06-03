'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/roles'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

// Hook to check if user is authenticated
export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  return { user, isAuthenticated, isLoading }
}

// Hook to check role-based access
export function useRole(allowedRoles: UserRole[]) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  
  const hasAccess = user ? allowedRoles.includes(user.role) : false
  
  return {
    hasAccess,
    user,
    isAuthenticated,
    isLoading
  }
}

// Component to protect routes based on role
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        router.push(`/auth/login?redirect=${pathname}`)
        return
      }

      if (allowedRoles && !allowedRoles.includes(user?.role as UserRole)) {
        // Logged in but wrong role, redirect to appropriate dashboard
        const role = user?.role as UserRole
        switch (role) {
          case UserRole.CITIZEN:
            router.push('/citizen/dashboard')
            break
          case UserRole.OFFICER:
          case UserRole.DEPARTMENT_HEAD:
            router.push('/officer/dashboard')
            break
          case UserRole.SUPERADMIN:
            router.push('/superadmin/dashboard')
            break
          default:
            router.push('/auth/login')
        }
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, allowedRoles, router, pathname])

  // Show loading skeleton while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  // Not authenticated or no access
  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role as UserRole))) {
    return null
  }

  return <>{children}</>
}

// Hook to get current user role
export function useUserRole() {
  const { user } = useAuthStore()
  return user?.role as UserRole | undefined
}

// Hook to check specific permission
export function usePermission(check: (role: UserRole) => boolean) {
  const { user } = useAuthStore()
  return user ? check(user.role as UserRole) : false
}