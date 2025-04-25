import { Router } from "express";
import jwt from 'jsonwebtoken'

const getCurrentUser = Router()

interface userPayload {
    id?: string
    email?: string
}

getCurrentUser.get('/get-current-user', async (req, res) =>{
    const token = req.cookies.authToken
    if (!token) {
        res.status(401).json({success: false, message: 'no token provided'})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as userPayload
    } catch (error) {
        console.log(error);
        
    }
})

export default getCurrentUser