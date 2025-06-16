import passport from "passport";
import {Strategy as googleStrategy} from 'passport-google-oauth20'
import prisma from "../prisma/client";
import {User as UserInMongodb} from "../models/userModel";
import syncFailureQueue from "../utils/dbSyncQueue";

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
    
    if(user){
        return done(null, user)
    }

    const email = profile.emails?.[0].value
    const existingUser = await prisma.user.findFirst({where: {email}})
    if(existingUser){
        user = await prisma.user.update({
            where: {email},
            data: {
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value || '',
                title: profile.displayName
            }
        })
        try {
        await UserInMongodb.updateOne(
            { uid: user.id},
            {$set: {googleId: user.googleId, email: user.email, title: user.title, avatar: user.avatar}},
        );
        } catch (err) {
        console.error('MongoDB sync failed', err);
        syncFailureQueue.push({user, attempts: 0}); 
        }

        return done(null, user)
    }

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
            try {

            const mongoUser = {
            uid: user.id,
            googleId: user.googleId,
            email: user.email,
            title: user.title,
            avatar: user.avatar
            };

            await UserInMongodb.updateOne({ uid: mongoUser.uid }, { $set: mongoUser }, { upsert: true });

            } catch (err) {
            console.error('MongoDB sync failed', err);
            syncFailureQueue.push({user, attempts: 0}); 
            }
        
       return done(null, user)
    } catch (error) {
        return done(error, undefined)
    }
}))