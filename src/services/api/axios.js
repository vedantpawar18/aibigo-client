import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://aibigo-server.vercel.app/api/v1' 
    : 'http://localhost:3000/api/v1')

// Request cache for GET requests (optimization - reduces redundant API calls)
const requestCache = new Map()
const CACHE_DURATION = 30000 // 30 seconds cache for GET requests

// Request deduplication (prevent duplicate concurrent requests)
const pendingRequests = new Map()

// Debug mode
const DEBUG = import.meta.env.DEV || false

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 30000, // 30 second timeout
})

/**
 * Generate cache key from request config
 */
const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`
}

/**
 * Request interceptor - Add auth token, deduplication, and cache clearing
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      if (DEBUG) {
        console.log('[Axios] Request with token:', config.method?.toUpperCase(), config.url)
      }
    } else {
      if (DEBUG) {
        console.warn('[Axios] Request without token:', config.method?.toUpperCase(), config.url)
      }
    }
    
    // For GET requests, implement caching
    if (config.method === 'get' || config.method === 'GET') {
      const cacheKey = getCacheKey(config)
      
      // Check cache first
      const cached = requestCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        if (DEBUG) {
          console.log('[Axios] Using cached response:', config.url)
        }
        // Mark to use cache in response interceptor
        config.__useCache = true
        config.__cacheKey = cacheKey
      }
      
      // Track pending requests for deduplication (will be handled by adapter if needed)
      config.__pendingKey = cacheKey
      
      // Add timestamp to prevent browser caching
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // For non-GET requests, clear related cache entries
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete' || config.method === 'patch') {
      // Clear cache for related endpoints
      const urlParts = config.url.split('/')
      if (urlParts.length > 0) {
        const basePath = urlParts.slice(0, -1).join('/')
        // Clear all cache entries for this base path
        for (const key of requestCache.keys()) {
          if (key.includes(basePath)) {
            requestCache.delete(key)
          }
        }
      }
    }
    
    return config
  },
  (error) => {
    if (DEBUG) {
      console.error('[Axios] Request error:', error)
    }
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle caching, deduplication, and data extraction
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if we should use cached response (before making request)
    if (response.config?.__useCache && response.config?.__cacheKey) {
      const cached = requestCache.get(response.config.__cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        if (DEBUG) {
          console.log('[Axios] Returning cached response:', response.config.url)
        }
        // Clean up pending request if it exists
        if (response.config.__pendingKey) {
          pendingRequests.delete(response.config.__pendingKey)
        }
        return cached.response
      }
    }
    
    if (DEBUG) {
      console.log('[Axios] Response:', response.config?.method?.toUpperCase(), response.config?.url, response.status, response.data)
    }
    
    // For GET requests, cache the response and clean up pending
    if (response.config && (response.config.method === 'get' || response.config.method === 'GET')) {
      const cacheKey = getCacheKey(response.config)
      
      // Clean up pending request
      if (response.config.__pendingKey) {
        pendingRequests.delete(response.config.__pendingKey)
      }
      
      // Cache successful responses
      if (response.status === 200) {
        requestCache.set(cacheKey, {
          response: { ...response }, // Clone response
          timestamp: Date.now()
        })
      }
    }
    
    // Don't modify response.data - let Redux slices handle the structure
    // Server may return data directly or wrapped in { data: {...} }
    // Redux slices should handle both cases
    
    return response
  },
  (error) => {
    if (DEBUG) {
      console.error('[Axios] Response error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.response?.data || error.message)
    }
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      
      if (status === 401) {
        // Unauthorized - logout user
        if (DEBUG) {
          console.warn('[Axios] 401 Unauthorized - logging out')
        }
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        // Clear all cache
        requestCache.clear()
        pendingRequests.clear()
        window.location.href = '/login'
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('[Axios] Access forbidden:', error.response.data)
      } else if (status === 429) {
        // Rate limited - show user-friendly message
        const retryAfter = error.response.headers['retry-after'] || 60
        console.error(`[Axios] Rate limit exceeded. Please try again after ${retryAfter} seconds.`)
        // You can dispatch a toast notification here if needed
        // toast.error(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`)
      } else if (status >= 500) {
        // Server error
        console.error('[Axios] Server error:', error.response.data)
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[Axios] Network error: No response from server', error.request)
    } else {
      // Error setting up request
      console.error('[Axios] Request error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

/**
 * Clear request cache (useful for manual refresh)
 */
export const clearCache = () => {
  requestCache.clear()
}

/**
 * Clear cache for specific endpoint
 */
export const clearCacheForEndpoint = (endpoint) => {
  for (const key of requestCache.keys()) {
    if (key.includes(endpoint)) {
      requestCache.delete(key)
    }
  }
}

export default axiosInstance
