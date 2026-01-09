/**
 * Cache Utility Functions
 * Centralized cache management for API optimization
 */

import { clearCacheForEndpoint } from '../services/api/axios'

/**
 * Clear cache for academics endpoints
 */
export const clearAcademicsCache = () => {
  clearCacheForEndpoint('/platform-admin/academics')
}

/**
 * Clear cache for engagement endpoints
 */
export const clearEngagementCache = () => {
  clearCacheForEndpoint('/platform-admin/engagement')
}

/**
 * Clear cache for business endpoints
 */
export const clearBusinessCache = () => {
  clearCacheForEndpoint('/platform-admin/business')
}

/**
 * Clear cache for institutes endpoints
 */
export const clearInstitutesCache = () => {
  clearCacheForEndpoint('/platform-admin/institutes')
}

/**
 * Clear cache for system endpoints
 */
export const clearSystemCache = () => {
  clearCacheForEndpoint('/platform-admin/system')
}

/**
 * Clear cache for dashboard
 */
export const clearDashboardCache = () => {
  clearCacheForEndpoint('/platform-admin/dashboard')
}

/**
 * Clear all platform admin cache
 */
export const clearAllPlatformAdminCache = () => {
  clearCacheForEndpoint('/platform-admin')
}
