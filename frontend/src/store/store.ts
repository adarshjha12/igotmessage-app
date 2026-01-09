"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import activityReducer from "../features/activitySlice";
import storyReducer from "../features/storySlice";
import postReducer from "../features/postSlice";
import reelReducer from "../features/reelSlice";
import chatReducer from "../features/chatSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    activity: activityReducer,
    story: storyReducer,
    post: postReducer,
    reel: reelReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
