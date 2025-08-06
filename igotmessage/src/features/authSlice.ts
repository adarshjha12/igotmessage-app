import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    username?: string | null;
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

const initialState: UserAuthInterface = {
  authenticated: false,
  user: {
    _id: '', // initially empty string
    googleId: '',
    email: '',
    phoneNo: null,
    title: '',
    avatar: '',
    verified: false,
    username: '',
    profilePicture: '',
    bio: '',
    followers: [],
    following: [],
    createdAt: '',
    updatedAt: '',
    isGuest: false
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addCurrentUserToStore: (state, action: PayloadAction<UserAuthInterface['user']>) => {
      state.user = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },
  },
});

export const { addCurrentUserToStore, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
