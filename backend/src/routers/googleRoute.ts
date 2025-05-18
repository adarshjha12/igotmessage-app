import '../services/googleOauth'
import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import prisma from '../prisma/client';

const gAuthRouter = express.Router()
const JWT_SECRET = process.env.JWT_SECRET!

const redirectUrl = process.env.NODE_ENV === 'production' ? `${process.env.PROD_FRONTEND_URL}/dash/home` : `${process.env.DEV_FRONTEND_URL}/dash/home`

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

            res.redirect(redirectUrl)
            
        } catch (error) {
            console.log(error);
            res.redirect('/login')
        }
    }
)
export default gAuthRouter