import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type PostType = "normal" | "poll";

export interface Poll {
  question: string;
  options: string[];
}

export interface MusicData {
  title: string;
  artist?: string;
  genre?: string;
  url: string;
  image?: string;
}

export interface PostPayload {
  userId: string
  text?: string;
  files?: File[];
  templateImage?: string;
  privacy: "public" | "private";
  postType: PostType;
  poll?: Poll | null;
  musicData?: MusicData
}

interface PostState {
  posts: PostPayload[];
  uploadPostStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadPostError: string | null;
  showPostUploadModal: boolean;
  postId?: string
}

const initialState: PostState = {
  posts: [],
  uploadPostStatus: "idle",
  uploadPostError: null,
  showPostUploadModal: false,
};

const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://igotmessage-app-backend.onrender.com"
    : "http://localhost:5000";

export const uploadPost = createAsyncThunk(
  "post/uploadPost",
  async (args: PostPayload) => {
    const {userId, text, files, privacy, postType, poll, musicData, templateImage } = args;
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("privacy", privacy);
    formData.append("postType", postType);
    if (postType === "normal") {
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }
      if (text) {
        formData.append("text", text);
      }
      if (templateImage) {
        formData.append("templateImage", templateImage);
      }
      formData.append("musicData", JSON.stringify(musicData));
    } else if (postType === "poll") {
      formData.append("poll", JSON.stringify(poll));
    }

    const response = await axios.post(`${backendUrl}/api/post/create-post`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setShowPostUploadModal: (state, action: PayloadAction<boolean>) => {
      state.showPostUploadModal = action.payload;
    },
  },
   extraReducers: (builder) => {
      builder.addCase(uploadPost.fulfilled, (state, action) => {
        state.uploadPostStatus = "succeeded";
        state.postId = action.payload.post._id
      });
  
      builder.addCase(uploadPost.rejected, (state, action) => {
        state.uploadPostStatus = "failed";
        state.uploadPostError = action.error.message ?? null;
      });
  
      builder.addCase(uploadPost.pending, (state) => {
        state.uploadPostStatus = "loading";
        state.uploadPostError = null;
      });
    },
});

export const { setShowPostUploadModal} = postSlice.actions;

export default postSlice.reducer;
