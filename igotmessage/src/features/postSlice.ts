import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PostType = "text" | "photo" | "video" | "poll";

export interface Poll {
  question: string;
  options: string[];
}

export interface PostPayload {
  text: string;
  files: File[];
  privacy: "public" | "friends" | "private";
  type: PostType;
  poll: Poll | null;
}

interface PostState {
  posts: PostPayload[];
  uploadPostStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadPostError: string | null;
  showPostUploadModal: boolean;
}

const initialState: PostState = {
  posts: [],
  uploadPostStatus: "idle",
  uploadPostError: null,
  showPostUploadModal: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
});

export const {} = postSlice.actions;

export default postSlice.reducer;
