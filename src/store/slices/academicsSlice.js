import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as academicsAPI from '../../services/api/academics'
import { clearAcademicsCache } from '../../utils/cacheUtils'

// Universities
export const createUniversity = createAsyncThunk(
  'academics/createUniversity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.createUniversity(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getUniversities = createAsyncThunk(
  'academics/getUniversities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.getUniversities(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Programs
export const createProgram = createAsyncThunk(
  'academics/createProgram',
  async (data, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.createProgram(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getPrograms = createAsyncThunk(
  'academics/getPrograms',
  async (params, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.getPrograms(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Subjects
export const createSubject = createAsyncThunk(
  'academics/createSubject',
  async (data, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.createSubject(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getSubjects = createAsyncThunk(
  'academics/getSubjects',
  async (params, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.getSubjects(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Chapters
export const createChapter = createAsyncThunk(
  'academics/createChapter',
  async (data, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.createChapter(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getChapters = createAsyncThunk(
  'academics/getChapters',
  async (params, { rejectWithValue }) => {
    try {
      const response = await academicsAPI.getChapters(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  universities: [],
  programs: [],
  subjects: [],
  chapters: [],
  loading: false,
  error: null,
}

const academicsSlice = createSlice({
  name: 'academics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Universities
      .addCase(createUniversity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUniversity.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.universities.push(payload)
        clearAcademicsCache() // Clear cache after mutation
      })
      .addCase(createUniversity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create university'
      })
      .addCase(getUniversities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUniversities.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.universities = Array.isArray(payload) ? payload : []
      })
      .addCase(getUniversities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load universities'
      })
      // Programs
      .addCase(getPrograms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPrograms.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.programs = Array.isArray(payload) ? payload : []
      })
      .addCase(getPrograms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load programs'
      })
      // Programs
      .addCase(createProgram.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.programs.push(payload)
        clearAcademicsCache() // Clear cache after mutation
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create program'
      })
      // Subjects
      .addCase(createSubject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.subjects.push(payload)
        clearAcademicsCache() // Clear cache after mutation
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create subject'
      })
      .addCase(getSubjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.subjects = Array.isArray(payload) ? payload : []
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load subjects'
      })
      // Chapters
      .addCase(createChapter.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createChapter.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.chapters.push(payload)
        clearAcademicsCache() // Clear cache after mutation
      })
      .addCase(createChapter.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to create chapter'
      })
      .addCase(getChapters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getChapters.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload?.data || action.payload
        state.chapters = Array.isArray(payload) ? payload : []
      })
      .addCase(getChapters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.error || action.payload?.message || 'Failed to load chapters'
      })
  },
})

export const { clearError } = academicsSlice.actions
export default academicsSlice.reducer
