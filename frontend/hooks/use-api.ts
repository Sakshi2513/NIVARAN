'use client'

import { useState, useCallback } from 'react'
import { apiClient, getApiErrorMessage } from '@/lib/api-client'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Generic hook for API calls
export function useApi<T = any>(options?: UseApiOptions<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, loading: true, error: null })
    
    try {
      const data = await promise
      setState({ data, loading: false, error: null })
      options?.onSuccess?.(data)
      return data
    } catch (error) {
      const errorMessage = getApiErrorMessage(error)
      setState({ data: null, loading: false, error: errorMessage })
      options?.onError?.(errorMessage)
      throw error
    }
  }, [options])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

// Hook for GET requests
export function useGet<T = any>(url: string, options?: UseApiOptions<T>) {
  const api = useApi<T>(options)
  
  const fetch = useCallback(() => {
    return api.execute(apiClient.get<T>(url))
  }, [url, api])
  
  return {
    ...api,
    fetch
  }
}

// Hook for POST requests
export function usePost<T = any>(url: string, options?: UseApiOptions<T>) {
  const api = useApi<T>(options)
  
  const post = useCallback((data?: any) => {
    return api.execute(apiClient.post<T>(url, data))
  }, [url, api])
  
  return {
    ...api,
    post
  }
}

// Hook for PUT requests
export function usePut<T = any>(url: string, options?: UseApiOptions<T>) {
  const api = useApi<T>(options)
  
  const put = useCallback((data?: any) => {
    return api.execute(apiClient.put<T>(url, data))
  }, [url, api])
  
  return {
    ...api,
    put
  }
}

// Hook for DELETE requests
export function useDelete<T = any>(url: string, options?: UseApiOptions<T>) {
  const api = useApi<T>(options)
  
  const remove = useCallback(() => {
    return api.execute(apiClient.delete<T>(url))
  }, [url, api])
  
  return {
    ...api,
    remove
  }
}