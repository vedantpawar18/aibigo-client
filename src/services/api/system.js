import axiosInstance from './axios'

export const createAdminUser = (data) => {
  return axiosInstance.post('/system/admin-users', data)
}

export const getAdminUsers = (params = {}) => {
  return axiosInstance.get('/platform-admin/system/admin-users', { params })
}

export const getAuditLogs = (params = {}) => {
  return axiosInstance.get('/platform-admin/system/audit-logs', { params })
}

export const upsertPlatformSetting = (data) => {
  return axiosInstance.post('/platform-admin/system/platform-settings', data)
}

export const getPlatformSettings = (params = {}) => {
  return axiosInstance.get('/platform-admin/system/platform-settings', { params })
}

export const createAnalyticsTrigger = (data) => {
  return axiosInstance.post('/platform-admin/system/analytics', data)
}

export const getAnalyticsTriggers = (params = {}) => {
  return axiosInstance.get('/platform-admin/system/analytics', { params })
}
