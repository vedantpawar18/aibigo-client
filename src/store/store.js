import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import platformAdminReducer from './slices/platformAdminSlice'
import academicsReducer from './slices/academicsSlice'
import engagementReducer from './slices/engagementSlice'
import institutesReducer from './slices/institutesSlice'
import businessReducer from './slices/businessSlice'
import systemReducer from './slices/systemSlice'
import logsReducer from './slices/logsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    platformAdmin: platformAdminReducer,
    academics: academicsReducer,
    engagement: engagementReducer,
    institutes: institutesReducer,
    business: businessReducer,
    system: systemReducer,
    logs: logsReducer,
  },
})
