import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    title: '',
    email: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addCurrentUserToStore: function (state, action) {
            state.title = action.payload.title
            state.email = action.payload.email
        }
    }
})

export const {addCurrentUserToStore} = authSlice.actions
export default authSlice.reducer