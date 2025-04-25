import { Router } from "express";
import jwt from 'jsonwebtoken'

const getCurrentUser = Router()

getCurrentUser.get('/get-current-user', async (req, res) =>{
    const token = req.cookies.authToken

    try {
        
    } catch (error) {
        
    }
})

export default getCurrentUser