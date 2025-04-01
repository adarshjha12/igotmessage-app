import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDetails{
    title: string,
    id: string,
    email: string
}

interface InitialState{
    userDetails : UserDetails
}

const initialState : InitialState = {
    userDetails : {
        title: '',
        id: '',
        email: ''
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers:{
        signInUser: () =>{},
        signOutUser: () =>{}
    }
})