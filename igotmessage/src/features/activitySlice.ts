import { createSlice } from "@reduxjs/toolkit";

interface Activity {
    panelOpen: boolean,
    isDark: boolean,
    story: {
      storyImage: string,
      selectImageClicked: boolean,
      selectMusicClicked: boolean,
      selectWriteClicked: boolean,
    }
}

const initialState : Activity = {
    isDark: false,
    panelOpen: false,
    story: {
      storyImage: '',
      selectImageClicked: false,
      selectMusicClicked: false,
      selectWriteClicked: false,
    }
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
            state.story.storyImage = action.payload
        },

        setImageClicked: function (state, action) {
          state.story.selectImageClicked = action.payload
        },

        setMusicClicked: function (state, action) {
          state.story.selectMusicClicked = action.payload
        },

        setWriteClicked: function (state, action) {
          state.story.selectWriteClicked = action.payload
        },
    }
})

export const {setDarkMode, setPanelOpen, setStoryImage, setImageClicked, setMusicClicked, setWriteClicked} = activitySlice.actions
export default activitySlice.reducer