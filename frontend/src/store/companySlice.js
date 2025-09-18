import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  loading: false,
  error: null,
  uploadProgress: 0,
  isEditing: false
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    updateProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload
    },
    clearProfile: (state) => {
      state.profile = null
      state.error = null
      state.uploadProgress = 0
      state.isEditing = false
    }
  }
})

export const {
  setLoading,
  setProfile,
  updateProfile,
  setError,
  clearError,
  setUploadProgress,
  setIsEditing,
  clearProfile
} = companySlice.actions

export default companySlice.reducer