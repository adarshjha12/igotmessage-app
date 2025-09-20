import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface ReelState {
  showReelUploadModal: boolean;
  uploadReelStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadReelError: string | null;
}

interface payload {
  userId: string;
  video: File;
}
const initialState: ReelState = {
  showReelUploadModal: false,
  uploadReelStatus: "idle",
  uploadReelError: null,
};

const backendUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/reels/upload`
    : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/reels/upload`;

export const uploadReel = createAsyncThunk(
  "uploadReel",
  async (payload: payload) => {
    const { userId, video } = payload;

    const formData = new FormData();
    if (userId) formData.append("userId", userId);
    if (video) formData.append("video", video);

    const res = await axios.post(backendUrl, formData, {
      withCredentials: true,
    });

    return res.data;
  }
);

const reelSlice = createSlice({
  name: "reel",
  initialState,
  reducers: {
    setShowReelUploadModal: (state, action) => {
      state.showReelUploadModal = action.payload;
    },
  },
});

const { reducer } = reelSlice;
export default reducer;
export const { setShowReelUploadModal } = reelSlice.actions;
