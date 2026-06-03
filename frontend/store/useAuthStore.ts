import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setLoading: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          // also set cookie for middleware if needed
          document.cookie = `nivaran_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          document.cookie = 'nivaran_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (data) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        })),
        
      setLoading: (status) => set({ isLoading: status })
    }),
    {
      name: 'auth-storage',
      // Only persist user and token
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
