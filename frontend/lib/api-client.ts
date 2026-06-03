import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/auth-store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip auth for certain endpoints
        const skipAuthEndpoints = ['/api/auth/login', '/api/auth/register', '/health']
        const isSkipEndpoint = skipAuthEndpoints.some(endpoint => 
          config.url?.includes(endpoint)
        )

        if (!isSkipEndpoint) {
          const token = useAuthStore.getState().token
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const token = useAuthStore.getState().token
            if (token) {
              // Optionally implement token refresh here
              // For now, just logout
              useAuthStore.getState().logout()
              window.location.href = '/auth/login'
            }
          } catch {
            useAuthStore.getState().logout()
            window.location.href = '/auth/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // HTTP methods
  async get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()

// Helper function to handle API errors
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Type-safe API methods
export const api = {
  get: <T>(url: string) => apiClient.get<T>(url),
  post: <T>(url: string, data?: any) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: any) => apiClient.put<T>(url, data),
  patch: <T>(url: string, data?: any) => apiClient.patch<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url)
}