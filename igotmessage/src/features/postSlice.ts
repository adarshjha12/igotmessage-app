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
  creating: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  creating: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    
  },
});

export const {} =
  postSlice.actions;

export default postSlice.reducer;
