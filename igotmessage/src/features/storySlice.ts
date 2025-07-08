import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
interface StoryState {
  storyImage: string;
  storyTextBg: string;
  musicData: {
    title: string;
    artist: string;
    genre: string;
    url: string;
    image: string;
  };
}

interface Response {
  success: boolean;
  message: string;
}

interface UploadArgs {
    userId: string;
    image: File;
    musicData: {
        title: string;
        artist: string;
        genre: string;
        url: string;
        image: File;
    };
}

const initialState: StoryState = {
  storyImage: "",
  storyTextBg: "",
  musicData: {
    title: "",
    artist: "",
    genre: "",
    url: "",
    image: "",
  },
};

const backendUrl = process.env.NODE_ENV === "production" ? "https://igotmessage-app-backend.onrender.com" : "http://localhost:5000";

const handleStoryUpload = createAsyncThunk<Response, UploadArgs>("story/uploadStory", async ({ userId, image, musicData }) => {
    
    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("image", image);
    formData.append("musicData", JSON.stringify(musicData));

    const response = await axios.post<Response>(`${backendUrl}/api/story/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
});

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStoryImage: (state, action) => {
      state.storyImage = action.payload;
    },
    setStoryTextBg: (state, action) => {
      state.storyTextBg = action.payload;
    },
    setMusicData: (state, action) => {
      state.musicData = action.payload;
    },
  },
});

export default storySlice.reducer;
export const { setStoryImage, setStoryTextBg, setMusicData } = storySlice.actions;