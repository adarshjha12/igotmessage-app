import '../services/googleOauth'
import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { UserModel } from "../models/userModel";

const authRouter = express.Router()
const JWT_SECRET = process.env.JWT_SECRET!
const FRONTEND_URL = process.env.FRONTEND_URL!

authRouter.get('/auth/google',
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent'
    })
  );

authRouter.get('https://igotmessage-app-backend.onrender.com/google/auth/callback/redirect', 
    passport.authenticate('google', {session: false}),
    async function (req: Request, res: Response) {
        try {
            let userInDb = await UserModel.findOne({googleId: req.user?.googleId})
            const payload = {
                id: userInDb?._id,
                title: userInDb?.title,
                email: userInDb?.email,
            }

            console.log(req.user);
            
            const token = jwt.sign(payload, JWT_SECRET)
            res.cookie('googleToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            res.redirect(FRONTEND_URL)
            
        } catch (error) {
            console.log(error);
            res.redirect('/login')
        }
    }
)
export default authRouter