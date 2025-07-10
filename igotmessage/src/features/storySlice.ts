import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface MusicData {
  title: string;
  artist: string;
  genre: string;
  url: string;
  image: string;
}
interface MyStoryType {
  _id: string;
  imageUrl: string;
  musicData?: MusicData;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
  updatedAt: string;
}
interface OtherStoryType {
  _id: string;
  imageUrl: string;
  musicData?: MusicData;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
  updatedAt: string;
}
interface StoryState {
  storyImage: string;
  storyTextBg: string;
  musicData: MusicData;
  myFetchedStories: MyStoryType[];
  otherFetchedStories: OtherStoryType[];
  uploadStoryStatus: "noApiCalls" |"loading" | "succeeded" | "failed";
  uploadStoryError: string | null;
  showStoryUploadModal: boolean
}

interface Res {
  success: boolean;
  message: string;
}

interface UploadArgs {
    userId: string;
    file: File;
    musicData?: {
        title: string;
        artist: string;
        genre: string;
        url: string;
        image: string;
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
  myFetchedStories: [],
  otherFetchedStories: [],
  uploadStoryStatus: "noApiCalls",
  uploadStoryError: null,
  showStoryUploadModal: false
};

const backendUrl = process.env.NODE_ENV === "production" ? "https://igotmessage-app-backend.onrender.com" : "http://localhost:5000";

export const handleStoryUpload = createAsyncThunk<Res, UploadArgs>("story/uploadStory", async ({ userId, file, musicData }) => {
    
    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("file", file);
    formData.append("musicData", JSON.stringify(musicData));

    const response = await axios.post<Res>(`${backendUrl}/api/story/upload-story`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
        console.log(response.data);
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
    setShowStoryUploadModal: (state, action) => {
      state.showStoryUploadModal = action.payload;
    },

    setMyFetchedStories: (state, action) => {
      state.myFetchedStories = action.payload;
    },

    setOtherFetchedStories: (state, action) => {
      state.otherFetchedStories = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(handleStoryUpload.fulfilled, (state, action) => {
        state.uploadStoryStatus = "succeeded";
      
    });

    builder.addCase(handleStoryUpload.rejected, (state, action) => {
        state.uploadStoryStatus = "failed";
        state.uploadStoryError = action.error.message ?? null;
    });

    builder.addCase(handleStoryUpload.pending, (state) => {
        state.uploadStoryStatus = "loading";
        state.uploadStoryError = null;
    });
  },
});

export default storySlice.reducer;
export const { setStoryImage, setStoryTextBg, setMusicData, setShowStoryUploadModal , setMyFetchedStories, setOtherFetchedStories} = storySlice.actions;