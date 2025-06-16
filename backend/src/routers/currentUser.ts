import { Router } from "express";
import jwt from 'jsonwebtoken'
import prisma from "../prisma/client";

const getCurrentUser = Router()

interface userPayload {
    id?: number
    email?: string
}
getCurrentUser.get('/get-current-user', async (req, res) =>{
    const token = req.cookies.authToken
    if (!token) {
        console.log('no token provided');
        
        res.status(401).json({success: false, message: 'no token provided'})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as userPayload
        const verifiedUser = await prisma.user.findUnique({where: {id: decoded.id}})

        if (!verifiedUser) {
            res.status(401).json({success: false, message: 'invalid token provided'})
            return
        }

        console.log('user is authorized');
        
        res.status(200).json({success: true, message: 'user verified successfully', userData: verifiedUser})
        return
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'server side error'})
    }
})

export default getCurrentUser