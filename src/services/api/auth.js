import axiosInstance from './axios'

export const login = (credentials) => {
  return axiosInstance.post('/auth/login', credentials)
}

export const register = (userData) => {
  return axiosInstance.post('/auth/register', userData)
}

export const forgotPassword = (email) => {
  return axiosInstance.post('/auth/forgot-password', { email })
}

export const resetPassword = (token, newPassword) => {
  return axiosInstance.post('/auth/reset-password', { token, newPassword })
}
