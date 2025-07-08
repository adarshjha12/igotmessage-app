'use client'

import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from '../features/authSlice'
import activityReducer from '../features/activitySlice'
import storyReducer from '../features/storySlice'

 const store = configureStore({
    reducer: {
        auth: authReducer,
        activity: activityReducer,
        story: storyReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store