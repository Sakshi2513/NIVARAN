// User roles enum
export enum UserRole {
  CITIZEN = 'citizen',
  OFFICER = 'officer',
  DEPARTMENT_HEAD = 'department_head',
  SUPERADMIN = 'superadmin'
}

// Backend role mapping
export const BACKEND_ROLES = {
  citizen: 'Citizen',
  officer: 'Officer',
  department_head: 'DepartmentHead',
  superadmin: 'SuperAdmin'
} as const

// Role hierarchy for permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.CITIZEN]: 1,
  [UserRole.OFFICER]: 2,
  [UserRole.DEPARTMENT_HEAD]: 3,
  [UserRole.SUPERADMIN]: 4
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.CITIZEN]: 'Citizen',
  [UserRole.OFFICER]: 'Officer',
  [UserRole.DEPARTMENT_HEAD]: 'Department Head',
  [UserRole.SUPERADMIN]: 'Super Admin'
}

// Role colors for UI
export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.CITIZEN]: 'blue',
  [UserRole.OFFICER]: 'green',
  [UserRole.DEPARTMENT_HEAD]: 'purple',
  [UserRole.SUPERADMIN]: 'red'
}