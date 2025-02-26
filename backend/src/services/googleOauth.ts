import passport from "passport";
import {Strategy as googleStrategy} from 'passport-google-oauth20'

const clientID = process.env.CLIENT_ID!
const clientSecret = process.env.CLIENT_SECRET!
const callbackURL =  '/api/auth/callback/google'

passport.use(new googleStrategy({
    clientID,
    clientSecret,
    callbackURL
}, async (accessToken, refreshToken, profile, done) =>{
    try {
       
    } catch (error) {
        return done(error, undefined)
    }
}))