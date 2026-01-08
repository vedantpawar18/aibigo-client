import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as institutesAPI from '../../services/api/institutes'

export const getInstitutes = createAsyncThunk(
  'institutes/getInstitutes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await institutesAPI.getInstitutes(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createInstitute = createAsyncThunk(
  'institutes/createInstitute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await institutesAPI.createInstitute(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  institutes: [],
  loading: false,
  error: null,
}

const institutesSlice = createSlice({
  name: 'institutes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInstitutes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getInstitutes.fulfilled, (state, action) => {
        state.loading = false
        state.institutes = action.payload
      })
      .addCase(getInstitutes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load institutes'
      })
      .addCase(createInstitute.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInstitute.fulfilled, (state, action) => {
        state.loading = false
        state.institutes.push(action.payload)
      })
      .addCase(createInstitute.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create institute'
      })
  },
})

export const { clearError } = institutesSlice.actions
export default institutesSlice.reducer
