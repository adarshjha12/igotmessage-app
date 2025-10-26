import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    chatId: '',
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatId: (state, action) => {
            state.chatId = action.payload
        }
    }
})

export default chatSlice.reducer

export const {setChatId} = chatSlice.actions