import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";

interface Activity {
    panelOpen: boolean,
    isDark: boolean,
    story: {
      storyImage: string,
      musicData: {
        title: string,
        artist: string,
        genre: string,
        url: string,
        image: string
      },
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
      musicData: {
        title: '',
        artist: '',
        genre: '',
        url: '',
        image: ''      },
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

        setMusicData: function (state, action) {
            state.story.musicData = action.payload
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

export const {setDarkMode, setPanelOpen, setStoryImage, setMusicData, setImageClicked, setMusicClicked, setWriteClicked} = activitySlice.actions
export default activitySlice.reducer