import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as systemAPI from '../../services/api/system'

export const getAdminUsers = createAsyncThunk(
  'system/getAdminUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await systemAPI.getAdminUsers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createAdminUser = createAsyncThunk(
  'system/createAdminUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await systemAPI.createAdminUser(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getAuditLogs = createAsyncThunk(
  'system/getAuditLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await systemAPI.getAuditLogs(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getPlatformSettings = createAsyncThunk(
  'system/getPlatformSettings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await systemAPI.getPlatformSettings(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const upsertPlatformSetting = createAsyncThunk(
  'system/upsertPlatformSetting',
  async (data, { rejectWithValue }) => {
    try {
      const response = await systemAPI.upsertPlatformSetting(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getAnalyticsTriggers = createAsyncThunk(
  'system/getAnalyticsTriggers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await systemAPI.getAnalyticsTriggers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createAnalyticsTrigger = createAsyncThunk(
  'system/createAnalyticsTrigger',
  async (data, { rejectWithValue }) => {
    try {
      const response = await systemAPI.createAnalyticsTrigger(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  adminUsers: [],
  auditLogs: [],
  pagination: null,
  platformSettings: [],
  analyticsTriggers: [],
  loading: false,
  error: null,
}

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.loading = false
        state.adminUsers = action.payload
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load admin users'
      })
      .addCase(createAdminUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.loading = false
        state.adminUsers.push(action.payload)
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create admin user'
      })
      .addCase(getAuditLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        // Handle response structure: backend returns { logs: [], pagination: {} }
        const payload = action.payload?.data || action.payload
        if (payload && typeof payload === 'object') {
          state.auditLogs = payload.logs || []
          state.pagination = payload.pagination || null
        } else {
          state.auditLogs = []
          state.pagination = null
        }
      })
      .addCase(getAuditLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load audit logs'
      })
      .addCase(getPlatformSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPlatformSettings.fulfilled, (state, action) => {
        state.loading = false
        state.platformSettings = action.payload
      })
      .addCase(getPlatformSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load platform settings'
      })
      .addCase(upsertPlatformSetting.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(upsertPlatformSetting.fulfilled, (state, action) => {
        state.loading = false
        const index = state.platformSettings.findIndex(s => s._id === action.payload._id)
        if (index >= 0) {
          state.platformSettings[index] = action.payload
        } else {
          state.platformSettings.push(action.payload)
        }
      })
      .addCase(upsertPlatformSetting.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to update platform setting'
      })
      .addCase(getAnalyticsTriggers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAnalyticsTriggers.fulfilled, (state, action) => {
        state.loading = false
        state.analyticsTriggers = action.payload
      })
      .addCase(getAnalyticsTriggers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load analytics triggers'
      })
      .addCase(createAnalyticsTrigger.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAnalyticsTrigger.fulfilled, (state, action) => {
        state.loading = false
        state.analyticsTriggers.push(action.payload)
      })
      .addCase(createAnalyticsTrigger.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create analytics trigger'
      })
  },
})

export const { clearError } = systemSlice.actions
export default systemSlice.reducer
