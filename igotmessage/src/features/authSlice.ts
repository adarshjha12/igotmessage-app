import {createSlice} from '@reduxjs/toolkit'

interface UserAuthInterface {
    authenticated: boolean,
    user: {
        id : number,
        googleId? : string,
        email? : string,
        phoneNo? : number,
        title? : string,
        avatar? : string,
        createdAt : string,
    }
}

const initialState : UserAuthInterface = {
    authenticated: false,
    user: {
        id : 1,
        googleId : '',
        email : '',
        phoneNo : 1234235659,
        title : '',
        avatar : '',
        createdAt : '',
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addCurrentUserToStore: function (state, action) {
            state.user = action.payload
        },

        setAuthStatus: function (state, action) {
            state.authenticated = action.payload
        },
    }
})

export const {addCurrentUserToStore, setAuthStatus} = authSlice.actions
export default authSlice.reducer