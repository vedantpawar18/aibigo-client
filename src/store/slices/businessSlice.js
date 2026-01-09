import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as businessAPI from '../../services/api/business'
import { clearBusinessCache } from '../../utils/cacheUtils'

export const getSubscriptionPlans = createAsyncThunk(
  'business/getSubscriptionPlans',
  async (params, { rejectWithValue }) => {
    try {
      const response = await businessAPI.getSubscriptionPlans(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createSubscriptionPlan = createAsyncThunk(
  'business/createSubscriptionPlan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await businessAPI.createSubscriptionPlan(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getPayments = createAsyncThunk(
  'business/getPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await businessAPI.getPayments(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createPayment = createAsyncThunk(
  'business/createPayment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await businessAPI.createPayment(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  subscriptionPlans: [],
  payments: [],
  loading: false,
  error: null,
}

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.subscriptionPlans = Array.isArray(payload) ? payload : []
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load subscription plans'
      })
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.subscriptionPlans.push(payload)
        clearBusinessCache() // Clear cache after mutation
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create subscription plan'
      })
      .addCase(getPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.payments = Array.isArray(payload) ? payload : []
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load payments'
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.payments.push(payload)
        clearBusinessCache() // Clear cache after mutation
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create payment'
      })
  },
})

export const { clearError } = businessSlice.actions
export default businessSlice.reducer
