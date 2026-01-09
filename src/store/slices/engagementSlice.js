import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as engagementAPI from '../../services/api/engagement'
import { clearEngagementCache } from '../../utils/cacheUtils'

export const getOpportunities = createAsyncThunk(
  'engagement/getOpportunities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.getOpportunities(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createOpportunity = createAsyncThunk(
  'engagement/createOpportunity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.createOpportunity(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getIndustryPartners = createAsyncThunk(
  'engagement/getIndustryPartners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.getIndustryPartners()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createIndustryPartner = createAsyncThunk(
  'engagement/createIndustryPartner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.createIndustryPartner(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getAssessments = createAsyncThunk(
  'engagement/getAssessments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.getAssessments(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createAssessment = createAsyncThunk(
  'engagement/createAssessment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.createAssessment(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getCourses = createAsyncThunk(
  'engagement/getCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.getCourses(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createCourse = createAsyncThunk(
  'engagement/createCourse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await engagementAPI.createCourse(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  opportunities: [],
  industryPartners: [],
  assessments: [],
  courses: [],
  loading: false,
  error: null,
}

const engagementSlice = createSlice({
  name: 'engagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOpportunities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getOpportunities.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.opportunities = Array.isArray(payload) ? payload : []
      })
      .addCase(getOpportunities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load opportunities'
      })
      .addCase(createOpportunity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.opportunities.push(payload)
        clearEngagementCache() // Clear cache after mutation
      })
      .addCase(createOpportunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create opportunity'
      })
      .addCase(createIndustryPartner.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createIndustryPartner.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.industryPartners.push(payload)
        clearEngagementCache() // Clear cache after mutation
      })
      .addCase(createIndustryPartner.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create industry partner'
      })
      .addCase(getIndustryPartners.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getIndustryPartners.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.industryPartners = Array.isArray(payload) ? payload : []
      })
      .addCase(getIndustryPartners.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load industry partners'
      })
      .addCase(getAssessments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAssessments.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.assessments = Array.isArray(payload) ? payload : []
      })
      .addCase(getAssessments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load assessments'
      })
      .addCase(createAssessment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.assessments.push(payload)
        clearEngagementCache() // Clear cache after mutation
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create assessment'
      })
      .addCase(getCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.courses = Array.isArray(payload) ? payload : []
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load courses'
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.courses.push(payload)
        clearEngagementCache() // Clear cache after mutation
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create course'
      })
  },
})

export const { clearError } = engagementSlice.actions
export default engagementSlice.reducer
