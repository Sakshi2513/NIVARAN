import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState, LoginCredentials, RegisterData, UserRole } from '@/types/auth'
import { apiClient } from '@/lib/api-client'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post<{ token: string; user: any }>('/api/auth/login', credentials)
          
          // Map backend role to frontend role
          const backendRole = response.user.role
          const frontendRole = backendRole.toLowerCase().replace('departmenthead', 'department_head') as UserRole
          
          const user: User = {
            id: response.user._id || response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: frontendRole
          }
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          // Map frontend role to backend role
          const backendRole = data.role === 'department_head' ? 'DepartmentHead' : 
                             data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : 'Citizen'
          
          const response = await apiClient.post<{ token: string; user: any }>('/api/auth/register', {
            ...data,
            role: backendRole
          })
          
          const user: User = {
            id: response.user._id || response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: data.role || UserRole.CITIZEN
          }
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      setToken: (token: string | null) => {
        set({ token })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      checkAuth: async () => {
        const { token, user } = get()
        if (!token || !user) {
          set({ isAuthenticated: false })
          return
        }
        set({ isAuthenticated: true })
      }
    }),
    {
      name: 'nivaran-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)