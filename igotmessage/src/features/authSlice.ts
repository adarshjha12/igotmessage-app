import {createSlice} from '@reduxjs/toolkit'

interface UserAuthInterface {
    id : number,
    googleId? : string,
    email? : string,
    phoneNo? : number,
    title? : string,
    avatar? : string,
    createdAt : string,
}

const initialState : UserAuthInterface = {
    id : 1,
    googleId : '',
    email : '',
    phoneNo : 1234235659,
    title : '',
    avatar : '',
    createdAt : '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addCurrentUserToStore: function (state, action) {
            state = action.payload
            state = action.payload
        }
    }
})

export const {addCurrentUserToStore} = authSlice.actions
export default authSlice.reducer