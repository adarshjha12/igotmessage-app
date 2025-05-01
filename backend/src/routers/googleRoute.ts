import '../services/googleOauth'
import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import prisma from '../prisma/client';

const gAuthRouter = express.Router()
const JWT_SECRET = process.env.JWT_SECRET!

gAuthRouter.get('/auth/google',
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent'
    })
  );

gAuthRouter.get('/auth/callback/redirect', 
    passport.authenticate('google', {session: false}),
    async function (req: Request, res: Response) {
        try {
            let userInDb = await prisma.user.findFirst({where: {googleId: req.user?.googleId}})
            const payload = {
                id: userInDb?.id,
                email: userInDb?.email,
            }

            console.log(req.user);
            
            const token = jwt.sign(payload, JWT_SECRET)
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            res.status(201).json({success: true, message: 'user verified successfully', userData: userInDb})
            res.redirect('/dash')
            
        } catch (error) {
            console.log(error);
            res.redirect('/login')
        }
    }
)
export default gAuthRouter