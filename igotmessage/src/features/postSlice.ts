import uploadMultiple from "@/utils/uploadFile";
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
  isReposted: boolean;
  postId: string;
  userId: string;
  privacy: "public" | "private";
};

interface PostState {
  uploadPostStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadPostError: string | null;
  isReposted?: boolean;
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

    const body: any = {
      userId,
      text,
      privacy,
      postType,
      poll: postType === "poll" ? poll : undefined,
      musicData,
      templateImage,
    };

    if (postType === "normal" && files && files.length > 0) {
      try {
        const uploadedFiles = await uploadMultiple(files);
        body.files = uploadedFiles.map((file: any) => ({ url: file.url }));
      } catch (error) {

        console.log("❌ File upload error:", error);
      }
    }

    console.log("📤 Sending post data:", body);

    const response = await axios.post(
      `${backendUrl}/api/post/create-post`,
      body,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
);

export const repost = createAsyncThunk(
  "post/repost",
  async (payload: RepostPayload) => {
    const { isReposted, userId, postId, privacy } = payload;
    const res = await axios.post(
      `${backendUrl}/api/post/create-repost`,
      { isReposted, postId, userId, privacy },
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
      state.isReposted = action.payload.post.isReposted;
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
