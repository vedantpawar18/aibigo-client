import axiosInstance from './axios'

export const createOpportunity = (data) => {
  return axiosInstance.post('/platform-admin/engagement/opportunities', data)
}

export const getOpportunities = (params = {}) => {
  return axiosInstance.get('/platform-admin/engagement/opportunities', { params })
}

export const createIndustryPartner = (data) => {
  return axiosInstance.post('/platform-admin/engagement/industry-partners', data)
}

export const getIndustryPartners = () => {
  return axiosInstance.get('/platform-admin/engagement/industry-partners')
}

export const createAssessment = (data) => {
  return axiosInstance.post('/platform-admin/engagement/assessments', data)
}

export const getAssessments = (params = {}) => {
  return axiosInstance.get('/platform-admin/engagement/assessments', { params })
}

export const createCourse = (data) => {
  return axiosInstance.post('/platform-admin/engagement/courses', data)
}

export const getCourses = (params = {}) => {
  return axiosInstance.get('/platform-admin/engagement/courses', { params })
}
