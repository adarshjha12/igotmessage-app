import passport from "passport";
import {Strategy as googleStrategy} from 'passport-google-oauth20'
import prisma from "../prisma/client";

const clientID = process.env.CLIENT_ID!
const clientSecret = process.env.CLIENT_SECRET!
const callbackURL =  process.env.NODE_ENV === 'production' 
? 'https://igotmessage-app-backend.onrender.com/api/google/auth/callback/redirect' 
: 'http://localhost:5000/api/google/auth/callback/redirect'


passport.use(new googleStrategy({
    clientID,
    clientSecret,
    callbackURL
}, async (accessToken, refreshToken, profile, done) =>{
    try {
    let user = await prisma.user.findFirst({where: {googleId: profile.id}})

    if (!user) {
        if (profile.emails?.[0]?.value) {
            user = await prisma.user.findFirst({where: {email: profile.emails?.[0]?.value}})

            if (user) {
                user = await prisma.user.update({
                    where: {email: profile.emails?.[0]?.value},
                    data: {googleId: profile.id}
                })
            }
        }

        if(!user){
            user = await prisma.user.create(
                {
                    data: {
                        googleId: profile.id!,
                        email: profile.emails?.[0]?.value || '',
                        title: profile.displayName,
                        avatar: profile.photos?.[0]?.value || ''
                    }
                }
             )
        }
    }
       return done(null, user)
    } catch (error) {
        return done(error, undefined)
    }
}))