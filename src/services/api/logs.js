/**
 * Log Management API Service
 * Optimized API calls for log retrieval
 */

import axiosInstance from './axios'

/**
 * Get list of log files
 */
export const getLogFiles = () => {
  return axiosInstance.get('/platform-admin/system/logs/files')
}

/**
 * Get recent logs from all files
 * @param {Object} params - Query parameters (lines, level, search)
 */
export const getRecentLogs = (params = {}) => {
  return axiosInstance.get('/platform-admin/system/logs/recent', { params })
}

/**
 * Get log statistics
 */
export const getLogStatistics = () => {
  return axiosInstance.get('/platform-admin/system/logs/statistics')
}

/**
 * Read specific log file
 * @param {string} filename - Log file name
 * @param {Object} params - Query parameters (lines, level, search)
 */
export const readLogFile = (filename, params = {}) => {
  return axiosInstance.get(`/platform-admin/system/logs/files/${filename}`, { params })
}
