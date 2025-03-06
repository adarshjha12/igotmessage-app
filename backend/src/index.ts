import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import '../src/services/googleOauth'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './db/connection'
import passport from 'passport'
import authRouter from './routers/googleRoute'

const PORT = process.env.PORT
const app = express()
connectDb()

app.use(passport.initialize())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/verify/google', authRouter)


app.listen(PORT, () =>{
    console.log(`running on ${PORT}`);
})
