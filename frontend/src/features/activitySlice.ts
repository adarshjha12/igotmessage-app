import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Activity {
  panelOpen: boolean;
  isDark: boolean;
}

const initialState: Activity = {
  isDark: false,
  panelOpen: false,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setDarkMode: function (state, action) {
      state.isDark = action.payload;
    },

    setPanelOpen: function (state, action) {
      state.panelOpen = action.payload;
    },
  },
});

export const { setDarkMode, setPanelOpen } = activitySlice.actions;
export default activitySlice.reducer;
