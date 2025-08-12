import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAuthInterface {
  authenticated: boolean;
  user: {
    _id: string;
    googleId?: string | null;
    isGuest?: boolean;
    email?: string | null;
    phoneNo?: number | null;
    title?: string | null;
    avatar?: string | null;
    verified?: boolean;
    userName?: string | null;
    fullName?: string | null;
    profilePicture?: string | null;
    coverPhoto?: string | null;
    bio?: string | null;
    followers?: string[];
    following?: string[];
    createdAt?: string;
    updatedAt?: string;
  };
}

interface Res {
  success: boolean;
  message: string;
}

interface UploadArgs {
  userId: string;
  coverPic?: File;
  profilePic?: File;
  fullName: string;
  userName: string;
  bio: string;
}

const url =
  process.env.NODE_ENV === "production"
    ? "https://igotmessage-app-backend.onrender.com"
    : "http://localhost:5000";

const initialState: UserAuthInterface = {
  authenticated: false,
  user: {
    _id: "", // initially empty string
    googleId: "",
    email: "",
    phoneNo: null,
    title: "",
    avatar: "",
    verified: false,
    userName: "",
    profilePicture: "",
    bio: "",
    followers: [],
    following: [],
    createdAt: "",
    updatedAt: "",
    isGuest: false,
  },
};

export const handleProfileUpdate = createAsyncThunk<Res, UploadArgs>(
  "profile/handleProfileUpdate",
  async ({ userId, fullName, userName, bio }) => {
    return { success: true, message: "hh" };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addCurrentUserToStore: (
      state,
      action: PayloadAction<UserAuthInterface["user"]>
    ) => {
      state.user = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },
  },
});

export const { addCurrentUserToStore, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
