import axiosInstance from './axios'

export const getDashboardOverview = () => {
  return axiosInstance.get('/platform-admin/dashboard/overview')
}
