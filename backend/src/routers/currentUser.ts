import { Router } from "express";
import jwt from 'jsonwebtoken'
import prisma from "../prisma/client";

const getCurrentUser = Router()

interface userPayload {
    id?: number | undefined
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
        const verifyUser = await prisma.user.findUnique({where: {id: decoded.id}})

        if (!verifyUser) {
            res.status(401).json({success: false, message: 'invalid token provided'})
            return
        }

        res.status(200).json({success: true, message: 'user verified successfully', user: verifyUser})
        return
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'server side error'})
    }
})

export default getCurrentUser