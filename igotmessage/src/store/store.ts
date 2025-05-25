'use client'

import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from '../features/authSlice'
import activitySlide from '../features/activitySlice'

 const store = configureStore({
    reducer: {
        auth: authReducer,
        activity: activitySlide
    }
})

export type RootState = ReturnType<typeof store.getState>
export default store