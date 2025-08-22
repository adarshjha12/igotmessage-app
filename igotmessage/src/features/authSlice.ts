import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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
    updateProfileStatus: "idle" | "loading" | "succeeded" | "failed";
    logOutStatus: "idle" | "loading" | "succeeded" | "failed";
    updateProfileError: string | null;
    showProfileUpdateModal: boolean;
    logOutError: string | null;
  };
}

interface Res {
  success: boolean;
  message: string;
  profile: {
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

interface UploadArgs {
  userId: string;
  coverPic?: File;
  profilePic?: File;
  fullName?: string;
  userName?: string;
  bio?: string;
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
    updateProfileStatus: "idle",
    logOutStatus: "idle",
    updateProfileError: null,
    logOutError: null,
    showProfileUpdateModal: false,
  },
};

export const handleProfileUpdate = createAsyncThunk<Res, UploadArgs>(
  "profile/profileUpdate",
  async ({ userId, fullName, userName, bio, profilePic, coverPic }) => {
    const formData = new FormData();
    formData.append("userId", userId);
    if (fullName) formData.append("fullName", fullName);
    if (userName) formData.append("userName", userName);
    if (bio) formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    const response = await axios.post<Res>(
      `${url}/api/profile/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);

    return response.data;
  }
);

export const logOut = createAsyncThunk("logOut", async () => {
  const newUrl =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL}/api/logout`
      : `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/logout`;

  const response = await axios.get(newUrl, { withCredentials: true });
  return response.data;
});

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
    setProfileUpdateStatus: (state, action) => {
      state.user.updateProfileStatus = action.payload;
    },
    setShowProfileUpdateModal: (state, action: PayloadAction<boolean>) => {
      state.user.showProfileUpdateModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleProfileUpdate.fulfilled, (state, action) => {
      state.user.updateProfileStatus = "succeeded";
      state.user.userName = action.payload.profile.userName;
      state.user.fullName = action.payload.profile.fullName;
      state.user.bio = action.payload.profile.bio;
      state.user.profilePicture = action.payload.profile.profilePicture;
      state.user.coverPhoto = action.payload.profile.coverPhoto;
    });

    builder.addCase(handleProfileUpdate.rejected, (state, action) => {
      state.user.updateProfileStatus = "failed";
      state.user.updateProfileError = action.error.message ?? null;
    });

    builder.addCase(handleProfileUpdate.pending, (state) => {
      state.user.updateProfileStatus = "loading";
      state.user.updateProfileError = null;
    });

    builder.addCase(logOut.fulfilled, (state) => {
      state.user.logOutStatus = "succeeded";
    });

    builder.addCase(logOut.rejected, (state, action) => {
      state.user.logOutStatus = "failed";
      state.user.logOutError = action.error.message ?? null;
    });

    builder.addCase(logOut.pending, (state) => {
      state.user.logOutStatus = "loading";
      state.user.updateProfileError = null;
    });
  },
});

export const {
  addCurrentUserToStore,
  setAuthStatus,
  setShowProfileUpdateModal,
  setProfileUpdateStatus,
} = authSlice.actions;
export default authSlice.reducer;
