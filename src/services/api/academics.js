import axiosInstance from './axios'

export const createUniversity = (data) => {
  return axiosInstance.post('/platform-admin/academics/universities', data)
}

export const getUniversities = (params = {}) => {
  return axiosInstance.get('/platform-admin/academics/universities', { params })
}

export const createProgram = (data) => {
  return axiosInstance.post('/platform-admin/academics/programs', data)
}

export const getPrograms = (params = {}) => {
  return axiosInstance.get('/platform-admin/academics/programs', { params })
}

export const createSubject = (data) => {
  return axiosInstance.post('/platform-admin/academics/subjects', data)
}

export const getSubjects = (params = {}) => {
  return axiosInstance.get('/platform-admin/academics/subjects', { params })
}

export const createChapter = (data) => {
  return axiosInstance.post('/platform-admin/academics/chapters', data)
}

export const getChapters = (params = {}) => {
  return axiosInstance.get('/platform-admin/academics/chapters', { params })
}
