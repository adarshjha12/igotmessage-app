import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type PostType = "normal" | "poll";

export interface PollOption {
  text: string;
  votes?: string[]; // optional, backend will handle adding users
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface MusicData {
  title: string;
  artist?: string;
  genre?: string;
  url: string;
  image?: string;
}

export interface PostPayload {
  userId: string;
  text?: string;
  files?: File[];
  templateImage?: string;
  privacy: "public" | "private";
  postType: PostType;
  poll?: Poll | null;
  musicData?: MusicData;
}

type RepostPayload = {
  isReposted: boolean
  postId: string;
  userId: string
  caption?: string;
  postType: "public" | "private"
};

interface PostState {
  uploadPostStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadPostError: string | null;
  showPostUploadModal: boolean;
  postId?: string;
  userIdInPost?: string;
  globalPostImage?: string;
}

const initialState: PostState = {
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
    const {
      userId,
      text,
      files,
      privacy,
      postType,
      poll,
      musicData,
      templateImage,
    } = args;
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

    const response = await axios.post(
      `${backendUrl}/api/post/create-post`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const repost = createAsyncThunk(
  "post/repost",
  async (payload: RepostPayload) => {
    const { isReposted, userId, postId,  caption, postType } = payload;
    const res = await axios.post(
      `${backendUrl}/api/post/create-repost`,
      { isReposted, postId, userId,  caption, postType },
      { withCredentials: true }
    );
    return res.data;
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setShowPostUploadModal: (state, action: PayloadAction<boolean>) => {
      state.showPostUploadModal = action.payload;
    },

    setGlobalPostImage: (state, action: PayloadAction<string>) => {
      state.globalPostImage = action.payload;
    },

    setUploadPostStatus: (state, action) => {
      state.uploadPostStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadPost.fulfilled, (state, action) => {
      state.uploadPostStatus = "succeeded";
      state.postId = action.payload.post._id;
      state.userIdInPost = action.payload.post.user;
    });

    builder.addCase(uploadPost.rejected, (state, action) => {
      state.uploadPostStatus = "failed";
      state.uploadPostError = action.error.message ?? null;
    });

    builder.addCase(uploadPost.pending, (state) => {
      state.uploadPostStatus = "loading";
      state.uploadPostError = null;
    });

    // for repost
    builder.addCase(repost.fulfilled, (state, action) => {
      state.uploadPostStatus = "succeeded";
      state.postId = action.payload.post._id;
      state.userIdInPost = action.payload.post.user;
    });

    builder.addCase(repost.rejected, (state, action) => {
      state.uploadPostStatus = "failed";
      state.uploadPostError = action.error.message ?? null;
    });

    builder.addCase(repost.pending, (state) => {
      state.uploadPostStatus = "loading";
      state.uploadPostError = null;
    });
  },
});

export const {
  setShowPostUploadModal,
  setGlobalPostImage,
  setUploadPostStatus,
} = postSlice.actions;

export default postSlice.reducer;
