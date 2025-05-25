import { createSlice } from "@reduxjs/toolkit";

interface Activity {
    panelOpen: boolean,
    isDark: boolean,
    storyImage: string
}

const initialState : Activity = {
    isDark: false,
    panelOpen: false,
    storyImage: ''
}

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        setDarkMode: function (state, action) {
            state.isDark = action.payload
        },

        setPanelOpen: function (state, action) {
            state.panelOpen = action.payload
        },

        setStoryImage: function (state, action) {
            state.storyImage = action.payload
        }
    }
})

export const {setDarkMode, setPanelOpen, setStoryImage} = activitySlice.actions
export default activitySlice.reducer