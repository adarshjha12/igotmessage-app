import passport, { use } from "passport";
import {Strategy as googleStrategy} from 'passport-google-oauth20'
import { UserModel } from "../models/userModel";

const clientID = process.env.CLIENT_ID!
const clientSecret = process.env.CLIENT_SECRET!
const callbackURL =  '/api/auth/callback/google'

passport.use(new googleStrategy({
    clientID,
    clientSecret,
    callbackURL
}, async (accessToken, refreshToken, profile, done) =>{
    try {
    let user = await UserModel.findOne({googleId: profile.id})

    if (!user) {
         user = await UserModel.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || '',
            title: profile.displayName,
            avatar: profile.photos?.[0]?.value || ''
        })
    }
       return done(null, user)

    } catch (error) {
        return done(error, undefined)
    }
}))