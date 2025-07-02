import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";

interface Activity {
    panelOpen: boolean,
    isDark: boolean,
    story: {
      storyImage: string,
      storyTextBg: string,
      musicData: {
        title: string,
        artist: string,
        genre: string,
        url: string,
        image: string
      },
      
    }
}

const initialState : Activity = {
    isDark: false,
    panelOpen: false,
    story: {
      storyImage: '',
      storyTextBg: '',
      musicData: {
        title: '',
        artist: '',
        genre: '',
        url: '',
        image: ''      
      },
      
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

        setStoryTextBg: function (state, action) {
            state.story.storyTextBg = action.payload
        },

        setMusicData: function (state, action) {
            state.story.musicData = action.payload
        },

    }
})

export const {setDarkMode, setPanelOpen, setStoryImage, setStoryTextBg, setMusicData} = activitySlice.actions
export default activitySlice.reducer