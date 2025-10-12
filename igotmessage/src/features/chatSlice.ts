import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    myId: '',
    data: {}
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatData: (state, action) => {
            state.data = action.payload
        }
    }
})

export default chatSlice.reducer

export const {setChatData} = chatSlice.actions