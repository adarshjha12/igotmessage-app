import {createSlice, nanoid} from '@reduxjs/toolkit'

const initialState = {
    title: '',
    email: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        hello: function () {
            
        }
    }
})
