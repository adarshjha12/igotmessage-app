import '../services/googleOauth'
import express, {Request, Response} from "express";
import { Jwt } from "jsonwebtoken";
import passport, { strategies } from "passport";

const router = express.Router()

router.get('/auth/google', 
    passport.authenticate('google', {scope:['profile', 'email']})
)

router.get('/api/auth/callback/google', 
    passport.authenticate('google', {failureRedirect: '/login'}),
    async function (req: Request, res: Response) {
        try {
            
        } catch (error) {
            
        }
    }
)
export default router