'use client'

import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from '../features/authSlice'
import activitySlice from '../features/activitySlice'

 const store = configureStore({
    reducer: {
        auth: authReducer,
        activity: activitySlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store