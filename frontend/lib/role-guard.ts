import { UserRole } from '@/types/roles'
import { useAuthStore } from '@/store/auth-store'

/**
 * Check if current user has required role
 */
export function hasRole(requiredRole: UserRole): boolean {
  const user = useAuthStore.getState().user
  if (!user) return false
  return user.role === requiredRole
}

/**
 * Check if current user has one of the allowed roles
 */
export function hasAnyRole(roles: UserRole[]): boolean {
  const user = useAuthStore.getState().user
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Check if current user has minimum role level
 */
export function hasMinRole(minRole: UserRole): boolean {
  const user = useAuthStore.getState().user
  if (!user) return false

  const hierarchy: Record<UserRole, number> = {
    [UserRole.CITIZEN]: 1,
    [UserRole.OFFICER]: 2,
    [UserRole.DEPARTMENT_HEAD]: 3,
    [UserRole.SUPERADMIN]: 4
  }

  return hierarchy[user.role] >= hierarchy[minRole]
}

/**
 * Check if user is citizen
 */
export function isCitizen(): boolean {
  return hasRole(UserRole.CITIZEN)
}

/**
 * Check if user is officer or above
 */
export function isOfficer(): boolean {
  return hasMinRole(UserRole.OFFICER)
}

/**
 * Check if user is department head or above
 */
export function isDepartmentHead(): boolean {
  return hasMinRole(UserRole.DEPARTMENT_HEAD)
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(): boolean {
  return hasRole(UserRole.SUPERADMIN)
}

/**
 * Get role-based redirect path
 */
export function getRoleRedirectPath(): string {
  const user = useAuthStore.getState().user
  if (!user) return '/auth/login'

  switch (user.role) {
    case UserRole.CITIZEN:
      return '/citizen/dashboard'
    case UserRole.OFFICER:
    case UserRole.DEPARTMENT_HEAD:
      return '/officer/dashboard'
    case UserRole.SUPERADMIN:
      return '/superadmin/dashboard'
    default:
      return '/'
  }
}

/**
 * Role permission checker
 */
export const permissions = {
  // Citizen permissions
  canFileComplaint: () => isCitizen(),
  canViewOwnComplaints: () => hasMinRole(UserRole.CITIZEN),
  
  // Officer permissions
  canViewAllComplaints: () => hasMinRole(UserRole.OFFICER),
  canUpdateComplaintStatus: () => hasMinRole(UserRole.OFFICER),
  canAssignComplaints: () => hasMinRole(UserRole.OFFICER),
  
  // Department Head permissions
  canManageDepartment: () => hasMinRole(UserRole.DEPARTMENT_HEAD),
  canViewDepartmentAnalytics: () => hasMinRole(UserRole.DEPARTMENT_HEAD),
  canEscalateComplaints: () => hasMinRole(UserRole.DEPARTMENT_HEAD),
  
  // Super Admin permissions
  canManageUsers: () => isSuperAdmin(),
  canManageSettings: () => isSuperAdmin(),
  canViewSystemAnalytics: () => isSuperAdmin(),
  canAccessAllDepartments: () => isSuperAdmin()
}