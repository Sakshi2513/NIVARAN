import { UserRole } from './roles'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface AuthResponse {
  token: string
  user: User
  message?: string
}