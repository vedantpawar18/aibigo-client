import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as logsAPI from '../../services/api/logs'

// Async thunks for log management
export const getLogFiles = createAsyncThunk(
  'logs/getLogFiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logsAPI.getLogFiles()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getRecentLogs = createAsyncThunk(
  'logs/getRecentLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await logsAPI.getRecentLogs(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getLogStatistics = createAsyncThunk(
  'logs/getLogStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logsAPI.getLogStatistics()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const readLogFile = createAsyncThunk(
  'logs/readLogFile',
  async ({ filename, params }, { rejectWithValue }) => {
    try {
      const response = await logsAPI.readLogFile(filename, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  logFiles: [],
  recentLogs: [],
  logStatistics: null,
  currentLogFile: null,
  loading: false,
  error: null,
}

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentLogFile: (state) => {
      state.currentLogFile = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Log Files
      .addCase(getLogFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLogFiles.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.logFiles = Array.isArray(payload) ? payload : []
      })
      .addCase(getLogFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load log files'
      })
      // Get Recent Logs
      .addCase(getRecentLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getRecentLogs.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.recentLogs = payload?.logs || []
      })
      .addCase(getRecentLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load recent logs'
      })
      // Get Log Statistics
      .addCase(getLogStatistics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getLogStatistics.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.logStatistics = payload
      })
      .addCase(getLogStatistics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load log statistics'
      })
      // Read Log File
      .addCase(readLogFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(readLogFile.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.currentLogFile = payload
      })
      .addCase(readLogFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to read log file'
      })
  },
})

export const { clearError, clearCurrentLogFile } = logsSlice.actions
export default logsSlice.reducer
