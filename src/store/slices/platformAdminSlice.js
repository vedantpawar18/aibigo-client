import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as platformAdminAPI from '../../services/api/platformAdmin'

export const getDashboardOverview = createAsyncThunk(
  'platformAdmin/getDashboardOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await platformAdminAPI.getDashboardOverview()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  dashboardOverview: null,
  loading: false,
  error: null,
}

const platformAdminSlice = createSlice({
  name: 'platformAdmin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDashboardOverview.fulfilled, (state, action) => {
        state.loading = false
        // Handle both direct data and wrapped data responses
        state.dashboardOverview = action.payload?.data || action.payload
      })
      .addCase(getDashboardOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load dashboard'
      })
  },
})

export const { clearError } = platformAdminSlice.actions
export default platformAdminSlice.reducer
