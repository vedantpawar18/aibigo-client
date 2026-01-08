import axiosInstance from './axios'

export const createSubscriptionPlan = (data) => {
  return axiosInstance.post('/platform-admin/business/subscription-plans', data)
}

export const getSubscriptionPlans = (params = {}) => {
  return axiosInstance.get('/platform-admin/business/subscription-plans', { params })
}

export const createPayment = (data) => {
  return axiosInstance.post('/platform-admin/business/payments', data)
}

export const getPayments = (params = {}) => {
  return axiosInstance.get('/platform-admin/business/payments', { params })
}
