import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import companyReducer from './companySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

// Export types for usage in components
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch