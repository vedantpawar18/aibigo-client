import axiosInstance from './axios'

export const createInstitute = (data) => {
  return axiosInstance.post('/platform-admin/institutes', data)
}

export const getInstitutes = (params = {}) => {
  return axiosInstance.get('/platform-admin/institutes', { params })
}
