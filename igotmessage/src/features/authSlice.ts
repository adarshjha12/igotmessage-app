import {createSlice} from '@reduxjs/toolkit'

interface UserAuthInterface {
    authenticated: boolean,
    panelOpen: boolean,
    isDark: boolean,
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
    isDark: false,
    panelOpen: false,
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

        setDarkMode: function (state, action) {
            state.isDark = action.payload
        },

        setPanelOpen: function (state, action) {
            state.panelOpen = action.payload
        },
    }
})

export const {addCurrentUserToStore, setAuthStatus, setDarkMode, setPanelOpen} = authSlice.actions
export default authSlice.reducer